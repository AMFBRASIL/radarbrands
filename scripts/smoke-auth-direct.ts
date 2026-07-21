import { config } from "dotenv";

config();

async function main() {
  const { hashPassword } = await import("../src/server/modules/auth/password.service.ts");
  const { registerUser } = await import("../src/server/modules/auth/auth.service.ts");

  const email = `direct+${Date.now()}@example.com`;
  console.log("email:", email);

  const hash = await hashPassword("Test1234!");
  console.log("hash ok:", hash.slice(0, 24));

  const request = new Request("http://localhost/api/v1/auth/register", {
    method: "POST",
    headers: { "user-agent": "smoke-direct" },
  });

  const result = await registerUser(
    {
      fullName: "Direct Smoke",
      companyName: "Smoke Co",
      email,
      password: "Test1234!",
      confirmPassword: "Test1234!",
    },
    request,
  );

  console.log("register ok:", result.auth.user.email, result.auth.organization?.displayName);
  console.log("role:", result.auth.membership?.roleCode);
  console.log("permissions:", result.auth.membership?.permissions.length);
  JSON.stringify(result.auth);
  console.log("json serialize ok");
}

main().catch((error) => {
  console.error("FAILED:", error);
  process.exit(1);
});
