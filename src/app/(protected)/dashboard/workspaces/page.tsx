"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { columns, User } from "./columns";
import { DataTable } from "./data-table";
import { Loader } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { usePat, useSelectedRows } from "@/components/pat-context";
import { Button } from "@/components/ui/button";
import { RowSelectionState, Updater } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

interface Workspace {
  gid: string;
  name: string;
  users: User[];
}

const Dashboard = () => {
  const { pat } = usePat();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [rowSelections, setRowSelections] = useState<{
    [gid: string]: RowSelectionState;
  }>({});
  const { selectedRows, setSelectedRows } = useSelectedRows();
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/getWorkspaces", {
        headers: {
          Authorization: pat,
        },
      });
      console.log(response.data);
      setWorkspaces(response.data);
      setLoading(false);
    };
    fetchData();
  }, [pat]);

  const handleRowSelectionChange = (
    gid: string,
    updater: Updater<RowSelectionState>
  ) => {
    setRowSelections((prev) => ({
      ...prev,
      [gid]: typeof updater === "function" ? updater(prev[gid] || {}) : updater,
    }));
  };

  const handleSelectedRowsChange = (gid: string, rows: User[]) => {
    setSelectedRows({ ...selectedRows, [gid]: rows });
  };

  const handleSubmit = () => {
    // Flatten all selected rows from all workspaces
    console.log(selectedRows);
    const allSelected = Object.values(selectedRows).flat();
    console.log(allSelected);
    if (startDate && endDate) {
      router.push(
        `/dashboard/${selectedWorkspace}/users?startDate=${format(
          startDate,
          "yyyy-MM-dd"
        )}&endDate=${format(endDate, "yyyy-MM-dd")}`
      );
      return;
    } else {
      toast.error("Start and end date are required");
    }
  };

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-bold mt-8'>Select Users From Workspaces</h1>
      <div className='flex flex-row gap-4 p-4 w-1/2 justify-center'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              data-empty={!startDate}
              className='data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal'
            >
              <CalendarIcon />
              {startDate ? (
                format(startDate, "PPP")
              ) : (
                <span>Pick Start Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={startDate}
              onSelect={setStartDate}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              data-empty={!endDate}
              className='data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal'
            >
              <CalendarIcon />
              {endDate ? format(endDate, "PPP") : <span>Pick End Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar mode='single' selected={endDate} onSelect={setEndDate} />
          </PopoverContent>
        </Popover>
      </div>
      <div className='flex flex-row gap-4 p-4 w-1/2 justify-center'>
        {loading ? (
          <div className='flex items-center justify-center'>
            <Loader className='animate-spin' />
          </div>
        ) : (
          <>
            <Combobox
              options={workspaces.map((workspace) => ({
                value: workspace.gid,
                label: workspace.name,
              }))}
              placeholder='Select a workspace'
              value={selectedWorkspace}
              onChange={setSelectedWorkspace}
            />
          </>
        )}
        <Button
          variant='outline'
          className='cursor-pointer'
          onClick={handleSubmit}
          disabled={
            Object.values(selectedRows).flat().length === 0 ? true : false
          }
        >
          Submit
        </Button>
      </div>
      {selectedWorkspace && (
        <DataTable
          columns={columns}
          data={
            workspaces.find((workspace) => workspace.gid === selectedWorkspace)
              ?.users || []
          }
          rowSelection={rowSelections[selectedWorkspace] || {}}
          onRowSelectionChange={(updater) =>
            handleRowSelectionChange(selectedWorkspace, updater)
          }
          onSelectedRowsChange={(rows) =>
            handleSelectedRowsChange(selectedWorkspace, rows)
          }
        />
      )}
    </div>
  );
};

export default Dashboard;
