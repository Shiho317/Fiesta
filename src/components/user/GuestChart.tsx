import moment from "moment";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

import { api } from "~/utils/api";
import { GuestStatusColor, GuestStatusColorCode } from "~/utils/enum";

type ChartDataProp = {
  title: string;
  value: number;
  color: string;
}[];

const GuestChart = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [chartData, setChartData] = useState<ChartDataProp | null>(null);
  const [totalLength, setTotalLenght] = useState<number>(0);
  const [respondedPercentage, setRespondedPercentage] = useState<number>(0);

  const { data: forthcomingEvent } = api.event.getForthcomingEvent.useQuery({
    userId: userId as string,
  });

  useEffect(() => {
    const dataArr = [];
    console.log(forthcomingEvent);
    if (
      forthcomingEvent &&
      forthcomingEvent.attend &&
      forthcomingEvent.attend > 0
    ) {
      const attendGuest = {
        title: "Attend",
        value: forthcomingEvent.attend,
        color: GuestStatusColorCode.ATTEND,
      };
      dataArr.push(attendGuest);
    }
    if (
      forthcomingEvent &&
      forthcomingEvent.decline &&
      forthcomingEvent.decline > 0
    ) {
      const declineGuest = {
        title: "Decline",
        value: forthcomingEvent.decline,
        color: GuestStatusColorCode.DECLINE,
      };
      dataArr.push(declineGuest);
    }
    if (
      forthcomingEvent &&
      forthcomingEvent.noResponse &&
      forthcomingEvent.noResponse > 0
    ) {
      const noResponseGuest = {
        title: "No Response",
        value: forthcomingEvent.noResponse,
        color: GuestStatusColorCode.WAITING,
      };
      dataArr.push(noResponseGuest);
    }
    setChartData(dataArr);

    const total =
      ((forthcomingEvent?.attend as number) ?? 0) +
      ((forthcomingEvent?.decline as number) ?? 0) +
      ((forthcomingEvent?.noResponse as number) ?? 0);

    const responded = Math.round(
      ((((forthcomingEvent?.attend as number) ?? 0) +
        ((forthcomingEvent?.decline as number) ?? 0)) /
        total) *
        100
    );
    setTotalLenght(total);
    setRespondedPercentage(responded);
  }, [forthcomingEvent]);

  return (
    <div className="flex items-center justify-center gap-6">
      {chartData && chartData.length > 0 ? (
        <>
          <div>
            <PieChart
              data={chartData}
              label={() => `${respondedPercentage}%`}
              labelPosition={0}
              reveal={100}
              lineWidth={20}
              background="#bfbfbf"
              lengthAngle={270}
              rounded={true}
              animate={true}
              animationDuration={1000}
              animationEasing="ease-in"
            />
          </div>
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Attendance</h3>
              <h4 className="text-md">
                {forthcomingEvent?.data.name ?? "Forthcoming Event"}
              </h4>
              <h5 className="text-sm">
                {forthcomingEvent?.data
                  ? moment(forthcomingEvent.data.eventDate).format(
                      "MMM Do YYYY"
                    )
                  : ""}
              </h5>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${GuestStatusColor.ATTEND}`}
              ></div>
              <h3>
                Attend:{" "}
                <span className="font-bold">
                  {forthcomingEvent?.attend ?? 0}
                </span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${GuestStatusColor.DECLINE}`}
              ></div>
              <h3>
                Decline:{" "}
                <span className="font-bold">
                  {forthcomingEvent?.decline ?? 0}
                </span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${GuestStatusColor.WAITING}`}
              ></div>
              <h3>
                Waiting:{" "}
                <span className="font-bold">
                  {forthcomingEvent?.noResponse ?? 0}
                </span>
              </h3>
            </div>
            <div className="my-2 h-[1px] w-full border-none bg-gray-300"></div>
            <h3 className="text-end">
              Total: <span className="font-bold">{totalLength}</span>
            </h3>
          </div>
        </>
      ) : (
        <div>No guest statistics of forthcoming event.</div>
      )}
    </div>
  );
};

export default GuestChart;
