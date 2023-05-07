import moment from "moment";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

import { api } from "~/utils/api";
import { EventStatusColor, EventStatusColorCode } from "~/utils/enum";

type ChartDataProp = {
  title: string;
  value: number;
  color: string;
}[];

const EventChart = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [chartData, setChartData] = useState<ChartDataProp | null>(null);
  const [totalLength, setTotalLength] = useState<number>(0);

  const { data: planningDataLength } =
    api.event.getCountOfPlanningStatus.useQuery({
      userId: userId as string,
    });

  const { data: completedDataLength } =
    api.event.getCountOfCompletedStatus.useQuery({
      userId: userId as string,
    });

  const { data: canceledDataLength } =
    api.event.getCountOfCanceledStatus.useQuery({
      userId: userId as string,
    });

  useEffect(() => {
    const dataArr = [];
    if (planningDataLength && planningDataLength > 0) {
      const planningData = {
        title: "Planning",
        value: planningDataLength,
        color: EventStatusColorCode.PLANNING,
      };
      dataArr.push(planningData);
    }
    if (completedDataLength && completedDataLength > 0) {
      const completedData = {
        title: "Completed",
        value: completedDataLength ?? 0,
        color: EventStatusColorCode.COMPLETED,
      };
      dataArr.push(completedData);
    }
    if (canceledDataLength && canceledDataLength > 0) {
      const canceledData = {
        title: "Canceled",
        value: canceledDataLength ?? 0,
        color: EventStatusColorCode.CANCELED,
      };
      dataArr.push(canceledData);
    }
    setChartData(dataArr);

    const total =
      (planningDataLength as number) +
      (completedDataLength as number) +
      (canceledDataLength as number);

    setTotalLength(total);
  }, [canceledDataLength, completedDataLength, planningDataLength]);

  return (
    <div className="flex items-center justify-center gap-6">
      {chartData && chartData.length > 0 ? (
        <>
          <div>
            <PieChart
              data={chartData}
              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
              labelStyle={{ fontSize: "8px" }}
              labelPosition={70}
              lineWidth={40}
              rounded={true}
              animate={true}
              animationDuration={1000}
              animationEasing="ease-in"
            />
          </div>
          <div>
            <div className="mb-12">
              <h3 className="text-lg font-semibold">Events Status</h3>
              <h5 className="text-sm">
                Updated: {moment(new Date()).format("MMM Do YYYY")}
              </h5>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${EventStatusColor.PLANNING}`}
              ></div>
              <h3>
                Planning:{" "}
                <span className="font-bold">{planningDataLength ?? 0}</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${EventStatusColor.COMPLETED}`}
              ></div>
              <h3>
                Completed:{" "}
                <span className="font-bold">{completedDataLength ?? 0}</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${EventStatusColor.CANCELED}`}
              ></div>
              <h3>
                Canceled:{" "}
                <span className="font-bold">{canceledDataLength ?? 0}</span>
              </h3>
            </div>
            <div className="my-2 h-[1px] w-full border-none bg-gray-300"></div>
            <h3 className="text-end">
              Total: <span className="font-bold">{totalLength}</span>
            </h3>
          </div>
        </>
      ) : (
        <div>No event statistics.</div>
      )}
    </div>
  );
};

export default EventChart;
