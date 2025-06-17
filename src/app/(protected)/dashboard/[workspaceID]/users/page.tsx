"use client";
import { usePat, useSelectedRows } from "@/components/pat-context";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams, useSearchParams } from "next/navigation";

interface apiResponse {
  assignee: {
    id: string;
    name: string;
  };
  data: {
    teamName: string;
    tasks: {
      id: string;
      name: string;
      teamID: string;
      teamName: string;
      due_on: number;
      completed_at: number;
      completed: boolean;
    }[];
  }[];
}

const Users = () => {
  const { selectedRows, setSelectedRows } = useSelectedRows();
  const { pat } = usePat();
  const [data, setData] = useState<apiResponse[]>([]);
  const { workspaceID } = useParams();
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  useEffect(() => {
    const fetchData = async () => {
      const allData = [];
      for (const user of selectedRows[workspaceID as string]) {
        const response = await axios.get(
          `/api/getTaskList/${workspaceID}/${user.gid}?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: pat,
            },
          }
        );
        allData.push(response.data);
      }
      const maxDataLength = Math.max(
        ...allData.map((item) => item.data.length)
      );
      const itemWithMaxData = allData.find(
        (item) => item.data.length === maxDataLength
      );
      allData.length = 0;
      for (const item of itemWithMaxData.data) {
        allData.push({ [item.teamName]: [] });
      }
      setData(allData as any);
      console.log(allData);
    };
    fetchData();
  }, []);

  return (
    <div className='pt-8 flex flex-col items-center justify-start h-screen w-full gap-8'>
      <h1 className='text-4xl font-bold'>Overdue Tasks</h1>
      {(() => {
        const maxDataLength = Math.max(...data.map((item) => item.data.length));
        const itemWithMaxData = data.find(
          (item) => item.data.length === maxDataLength
        );

        return itemWithMaxData ? (
          <div className='w-1/2 flex flex-col items-center justify-center gap-10'>
            {/* {itemWithMaxData.data.map((team) => (
              <div key={team.teamName} className='w-full'>
                <h3 className='text-xl font-medium mb-2'>{team.teamName}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Delay</TableHead>
                      <TableHead>Total Tasks</TableHead>
                      <TableHead>Delay %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map(
                      (item) =>
                        item.data.some((t) => t.teamName === team.teamName) && (
                          <TableRow key={item.assignee.id}>
                            <TableCell>{item.assignee.name}</TableCell>
                            <TableCell>
                              {
                                item.data
                                  .find((t) => t.teamName === team.teamName)
                                  ?.tasks.filter((t) => {
                                    if (t.due_on + 21660000 < t.completed_at) {
                                      console.log(t);
                                      return true;
                                    } else if (
                                      t.due_on > Date.now() &&
                                      t.completed === false
                                    ) {
                                      return true;
                                    }
                                    return false;
                                  }).length
                              }
                            </TableCell>
                            <TableCell>
                              {
                                item.data.find(
                                  (t) => t.teamName === team.teamName
                                )?.tasks.length
                              }
                            </TableCell>
                            <TableCell>{"0"}</TableCell>
                          </TableRow>
                        )
                    )}
                  </TableBody>
                </Table>
              </div>
            ))} */}
          </div>
        ) : null;
      })()}
    </div>
  );
};

export default Users;
