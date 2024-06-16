import React, { useState, useEffect } from "react";
import { Alert, Card } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


import DetailThingCard from "@/components/information_component/DetailThingCard";
import ObservationChart from "@/components/chart_component/ObservationChart"

const DetailThingPage = () => {
  const { token, intervalTimes } = useAuth();
  const { thingId } = useParams();

  const [observations, setObservations] = useState([]);
  const [error, setError] = useState(null);

  const fetchObservations = async (thingId, isAppend = false) => {
    try {
      const response = await axios.get(
        `/api/get/datastreams(${thingId})/observations?top=all`,
        {
          headers: { token },
        },
      );
      if (isAppend) {
        setObservations((prev) => [...prev, ...response.data]);
      } else {
        setObservations(response.data[0]);
      }
    } catch (error) {
      console.error("Lỗi lấy observations:", error);
      setError(error);
    }
  };
  useEffect(() => {
    if (thingId && token) {
      fetchObservations(thingId);
      // fetchActuators();

      const intervalTime = intervalTimes[thingId] || 5; // Default to 5 minutes if not set
      const interval = setInterval(
        () => {
          fetchObservations(thingId);
          // fetchActuators();
        },
        intervalTime * 60 * 1000,
      ); // Convert minutes to milliseconds

      return () => clearInterval(interval);
    }
  }, [thingId, token, intervalTimes]);

  if (error) {
    return (
      <div className="text-center">
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
      <section>
        <Card
          title="Tên Thing"
          style={{
            width: "100%",
            maxWidth: 600,
            // margin: "auto",
            // width: 600,
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
          }}
        >
          <p>Vị trí</p>
        </Card>

      </section>
      <section className="my-4 h-80 flex flex-col md:flex-row gap-4">
        <div className="h-full bg-white rounded-lg shadow-md mb-4 md:mb-0 md:w-1/2">
          <p>Thời tiết</p>
        </div>
        <div className="h-full bg-white rounded-lg shadow-md relative md:w-1/2">
          <img
            src="https://rangdong.com.vn/uploads/news/nha-thong-minh/cam-bien-thong-minh/cam-bien-anh-sang.jpg"
            className="w-full h-full object-cover rounded-lg shadow-md"
            alt="Image"
          />
          <div
            className="overlay transition-all duration-500 absolute bottom-0 w-full h-32 bg-gradient-to-t from-white to-transparent rounded-br-lg rounded-bl-lg p-4"
            onMouseEnter={() => {
              const overlay = document.querySelector(".overlay");
              overlay.classList.remove("h-32");
              overlay.classList.add("opacity-100", "h-full", "rounded-lg");


              const button = document.querySelector(".button");
              button.classList.add("hidden");

              const title = document.querySelector(".title");
              title.classList.remove("hidden");
              title.classList.add("block");
            }}
            onMouseLeave={() => {
              const overlay = document.querySelector(".overlay");
              overlay.classList.remove("bg-white", "h-full");
              overlay.classList.add("h-32");

              const button = document.querySelector(".button");
              button.classList.remove("hidden");

              const title = document.querySelector(".title");
              title.classList.remove("block");
              title.classList.add("hidden");
            }}
          >
            <div className="box relative bg-red h-full flex items-center">
              <button className="button absolute bottom-0 text-base font-semibold">
                Xem chi tiết
              </button>
              <p className="title hidden transition-all duration-500 text-sm">
                Thực thể Location định vị Thing hoặc những thứ mà nó liên kết. Thực thể
                Location của Thing được xác định là vị trí được biết cuối cùng của Thing
                đó.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className=" justify-center my-4 md:flex md:flex-row md:gap-4">
        <div className="h-full bg-white rounded-lg shadow-md mb-4 md:mb-0 md:flex-grow md:max-w-96 md:w-full">
          {observations.result && <DetailThingCard type={"Light"} data={observations} />}
        </div>
        <div className="h-full bg-white rounded-lg shadow-md md:max-w-96 md:w-full">
          {observations.result && <DetailThingCard type={"Soil"} data={observations} />}
        </div>
      </section>

      <section className="my-4">
        <ObservationChart datastreamId={thingId} />
      </section>
    </>
  );
};

export default DetailThingPage;
