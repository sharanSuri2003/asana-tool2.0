import axios from "axios";
export async function GET(request: Request) {
  const pat = request.headers.get("authorization");
  const workspaces = await axios.get(
    "https://app.asana.com/api/1.0/workspaces",
    {
      headers: {
        Authorization: `Bearer ${pat}`,
      },
    }
  );

  for (const workspace of workspaces.data.data) {
    const users = await axios.get(
      `https://app.asana.com/api/1.0/users?opt_fields=name,email,photo.image_36x36&workspace=${workspace.gid}`,
      {
        headers: { Authorization: `Bearer ${pat}` },
      }
    );
    workspace.users = users.data.data.filter(
      (user: {
        name: string;
        gid: string;
        email: string;
        photo: { image_36x36: string };
      }) => user.name !== "Private User"
    );
  }
  //console.log(workspaces.data);
  return Response.json(workspaces.data.data);
}
