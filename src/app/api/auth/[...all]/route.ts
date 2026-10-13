import { getAuth } from "@/lib/auth";
import { apiError } from "@/lib/admin";
export const runtime = "nodejs";
async function handler(request: Request) {
  try {
    return await getAuth().handler(request);
  } catch (error) {
    return apiError(error);
  }
}
export { handler as GET, handler as POST };
