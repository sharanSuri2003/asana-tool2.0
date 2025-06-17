import axios from "axios";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ workspaceID: string; userID: string }> },
  response: Response
) {
  const pat = request.headers.get("authorization");
  const url = request.url || (request as any).originalUrl;
  const queryString = url.split("?")[1] || "";
  const searchParams = new URLSearchParams(queryString);
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  console.log(startDate);
  console.log(endDate);
  const { workspaceID, userID } = await params;
  try {
    const teams = await axios.get(
      `https://app.asana.com/api/1.0/projects?workspace=${workspaceID}&opt_fields=team,team.name,name`,
      {
        headers: {
          Authorization: `Bearer ${pat}`,
        },
      }
    );

    const teamsData = teams.data.data.map((t: any) => ({
      name: t.name,
      gid: t.gid,
      teamgid: t.team.gid,
      teamname: t.team.name,
    }));

    //console.log(teams);

    const taskList = [];
    let api_url = `/tasks?limit=100&assignee=${userID}&workspace=${workspaceID}&opt_fields=completed_at,completed,due_on,due_at,projects,assignee,assignee.name,name,projects.name`;
    while (true) {
      const taskData = await axios.get(
        `https://app.asana.com/api/1.0${api_url}`,
        {
          headers: {
            Authorization: `Bearer ${pat}`,
          },
        }
      );
      taskList.push(...taskData.data.data);
      if (taskData.data.next_page) {
        api_url = taskData.data.next_page.path;
      } else {
        break;
      }
    }

    const formattedTasks = taskList.map((task: any) => ({
      id: task.gid,
      name: task.name,
      assigneeID: task.assignee?.gid,
      assigneeName: task.assignee?.name,
      completed: task.completed,
      completed_at: Date.parse(task.completed_at),
      due_at: Date.parse(task.due_at),
      due_on: Date.parse(task.due_on + "T23:59:00.000Z"),
      teamID:
        teamsData.find(
          (team: {
            teamgid: string;
            name: string;
            gid: string;
            teamname: string;
          }) => team.gid === task.projects[0]?.gid
        )?.teamgid || process.env.DEFAULT_TEAM_ID,
      teamName:
        teamsData.find(
          (team: {
            teamgid: string;
            name: string;
            gid: string;
            teamname: string;
          }) => team.gid === task.projects[0]?.gid
        )?.teamname || process.env.DEFAULT_TEAM_NAME,
    }));

    const filteredTasks = formattedTasks.filter((task) => {
      if (
        task.due_on >= Date.parse(startDate) &&
        task.due_on <= Date.parse(endDate)
      ) {
        return true;
      }
      return false;
    });

    return Response.json({
      assignee: {
        id: filteredTasks[0]?.assigneeID,
        name: filteredTasks[0]?.assigneeName,
      },
      data: Object.entries(
        filteredTasks.reduce((acc, task) => {
          if (!acc[task.teamName]) {
            acc[task.teamName] = [];
          }
          acc[task.teamName].push({
            id: task.id,
            name: task.name,
            teamID: task.teamID,
            teamName: task.teamName,
            due_on: task.due_on,
            completed_at: task.completed_at,
            completed: task.completed,
          });
          return acc;
        }, {} as Record<string, any[]>)
      ).map(([teamName, tasks]) => ({
        teamName,
        tasks,
      })),
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Axios error response:", error.response.data);
    } else {
      console.log(error);
    }
    return Response.error();
  }
}

/*
let count = 0;
    const filteredTasks = tasks_list.filter((task) => {
      if (!task.due_on) return false;
      if (
        Date.parse(task.due_on + "T23:59:00.000Z") >=
          Date.parse(startDate + "T00:00:00.000Z") &&
        Date.parse(task.due_on + "T23:59:00.000Z") <=
          Date.parse(endDate + "T23:59:00.000Z")
      ) {
        if (task.assignee?.name === "Sharan Suri") {
          count += 1;
        }
        return true;
      }
    });
    tasks_list.length = 0;
    tasks_list.push(...filteredTasks);
    console.log(count);
    const userwiseTotalTasks: { [key: string]: number } = {};

    for (const task of tasks_list) {
      if (!task.assignee) continue;

      if (userwiseTotalTasks[task.assignee.name]) {
        userwiseTotalTasks[task.assignee.name]++;
      } else {
        userwiseTotalTasks[task.assignee.name] = 1;
      }
    }

    for (const task of tasks_list) {
      if (
        Date.parse(task.completed_at) >=
        Date.parse(task.due_on + "T05:59:00.000Z") + 24 * 60 * 60 * 1000
      ) {
        overdue_tasks.push(task);
      } else if (
        task.completed === false &&
        Date.parse(task.due_on + "T23:59:00.000Z") <=
          Date.parse(task.due_on + "T05:59:00.000Z") + 24 * 60 * 60 * 1000
      ) {
        overdue_tasks.push(task);
      } else {
        continue;
      }
    }

    return Response.json({
      overdueLength: overdue_tasks.length,
      overdueData: overdue_tasks,
      userwiseTotalTasks: userwiseTotalTasks,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Axios error response:", error.response.data);
    } else {
      console.log(error);
    }
  }
*/
