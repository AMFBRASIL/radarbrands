import { config } from "dotenv";

config();

const base = process.env.SMOKE_BASE_URL ?? "http://localhost:8080";
const email = `smoke+${Date.now()}@example.com`;
const password = "Test1234!";

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
  credentials: "include",
  headers: { "content-type": "application/json", ...(options.headers ?? {}) },
  ...options,
  });
  const body = await response.json();
  return { status: response.status, body, headers: response.headers };
}

async function main() {
  console.log("base:", base);
  console.log("email:", email);

  const me1 = await request("/api/v1/auth/me");
  console.log("me unauth:", me1.status, me1.body.success, me1.body.error?.code);

  const reg = await request("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullName: "Smoke Test",
      companyName: "Smoke Co",
      email,
      password,
      confirmPassword: password,
    }),
  });
  console.log("register:", reg.status, JSON.stringify(reg.body));

  if (!reg.body.success) process.exit(1);

  const cookie = reg.headers.get("set-cookie");
  const me2 = await request("/api/v1/auth/me", {
    headers: cookie ? { cookie } : {},
  });
  console.log("me auth:", me2.status, me2.body.data?.user?.email);

  const logout = await request("/api/v1/auth/logout", {
    method: "POST",
    headers: cookie ? { cookie } : {},
  });
  console.log("logout:", logout.status, logout.body.success);

  const login = await request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, rememberMe: true }),
  });
  console.log("login:", login.status, login.body.success, login.body.data?.user?.email);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
