export async function loader() {
  return Response.json({
    devtools_page: "http://localhost:3000/devtools",
  });
}