import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import * as schema from "./db/schema";

function createAuth() {
  if (
    !process.env.BETTER_AUTH_SECRET ||
    process.env.BETTER_AUTH_SECRET.length < 32
  )
    throw new Error(
      "Configure BETTER_AUTH_SECRET antes de iniciar a administração.",
    );
  const origin = process.env.BETTER_AUTH_URL || "http://127.0.0.1:3000";
  return betterAuth({
    appName: "Zerith Administração",
    baseURL: origin,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [origin],
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      revokeSessionsOnPasswordReset: true,
    },
    user: {
      additionalFields: {
        isAdmin: { type: "boolean", defaultValue: false, input: false },
      },
      changeEmail: { enabled: false },
      deleteUser: { enabled: false },
    },
    session: {
      expiresIn: 60 * 60 * 8,
      updateAge: 60 * 15,
      freshAge: 60 * 15,
      cookieCache: { enabled: false },
    },
    advanced: {
      cookiePrefix: "zerith",
      useSecureCookies: origin.startsWith("https://"),
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 60,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/two-factor/*": { window: 60, max: 10 },
      },
    },
    plugins: [
      twoFactor({
        issuer: "Zerith Technologies",
        skipVerificationOnEnable: false,
      }),
    ],
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (
          [
            "/sign-up/email",
            "/two-factor/disable",
            "/delete-user",
            "/change-email",
          ].includes(ctx.path)
        )
          throw new APIError("FORBIDDEN", {
            message: "Operação indisponível para este painel.",
          });
        if (ctx.body && "trustDevice" in ctx.body) ctx.body.trustDevice = false;
      }),
      after: createAuthMiddleware(async (ctx) => {
        if (ctx.context.returned instanceof APIError) return;
        if (
          [
            "/two-factor/verify-totp",
            "/two-factor/verify-backup-code",
          ].includes(ctx.path)
        ) {
          const active = ctx.context.newSession ?? ctx.context.session;
          if (active?.session?.id) {
            const [owner] = await getDb()
              .select()
              .from(schema.user)
              .where(eq(schema.user.id, active.user.id));
            if (owner?.isAdmin && owner.twoFactorEnabled)
              await getDb().transaction(async (tx) => {
                await tx
                  .insert(schema.mfaProof)
                  .values({ sessionId: active.session.id })
                  .onConflictDoUpdate({
                    target: schema.mfaProof.sessionId,
                    set: { verifiedAt: new Date() },
                  });
                await tx
                  .insert(schema.audit)
                  .values({
                    id: crypto.randomUUID(),
                    actorId: owner.id,
                    action: "auth.mfa_verified",
                    entityId: active.session.id,
                  });
              });
          }
        }
      }),
    },
  });
}
let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() {
  return (instance ??= createAuth());
}
