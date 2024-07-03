// ThingPage.js

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Pagination, Button, Layout, Row, Col, Spin } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import HeaderThing from "@/components/home_component/thing_component/HeaderThing";
import { fetchThings } from "@/apis/ThingAPI";
import { useTheme } from "@/context/ThemeContext";
import "@public/styles/thing-page.css";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";
import { getImageForId } from "@/config/ThingConfig"; // Import getImageForId function

const { Content } = Layout;

const ThingPage = () => {
  const { token } = useAuth();
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const translations = useTranslations(language);

  const [things, setThings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 8;
  const navigate = useNavigate();

  const loadThings = async () => {
    try {
      const data = await fetchThings(token);
      setThings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThings();
  }, [token]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredThings = things.filter((thing) =>
    thing.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const currentThings = filteredThings.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <div className="text-center">Error: {error.message}</div>;
  }

  const handleSettingClick = (thingId) => {
    navigate(`/cai-dat-doi-tuong/${thingId}`);
  };

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="loading-text dark:text-dark-headline text-4xl font-bold text-gray-500">
            <Spin size="large" />
          </div>
        </div>
      ) : (
        <>
          <HeaderThing
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <div
            className={`mt-4 flex flex-col justify-center rounded-2xl border p-4 ${
              isDarkMode
                ? "dark:border-darkPrimary dark:bg-darkPrimary"
                : "border-white bg-white"
            }`}
          >
            <Layout
              className={`flex h-full w-full flex-col rounded-2xl ${
                isDarkMode
                  ? "dark:border-darkPrimary dark:bg-darkPrimary"
                  : "bg-white"
              }`}
            >
              <Content className="flex-grow">
                {things.length === 0 ? (
                  <div className="dark:text-dark-headline text-center">
                    {translations["Không có dữ liệu!"]}
                  </div>
                ) : (
                  <Row gutter={[16, 16]}>
                    {currentThings?.map((thing) => (
                      <Col xs={24} sm={12} md={8} lg={6} key={thing.id}>
                        <div
                          className={`card relative mb-4 flex flex-col overflow-hidden rounded-2xl shadow-md ${
                            isDarkMode ? "bg-dark-primary" : "bg-white"
                          }`}
                          style={{ height: "400px" }}
                        >
                          <div
                            className="image-container"
                            style={{
                              backgroundImage: `url(${getImageForId(thing.id)})`,
                            }}
                          >
                            <span className="bg-white px-4 py-1 text-right dark:bg-darkPrimary">
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="svg-glow mr-1 inline-block h-2 w-2"
                              >
                                <circle
                                  cx="5"
                                  cy="5"
                                  r="4"
                                  stroke="#38A169"
                                  strokeWidth="2"
                                />
                              </svg>{" "}
                              <span className="dark:text-white">online</span>
                            </span>
                          </div>

                          <div className="content flex-grow p-4 dark:text-white">
                            <div className="mb-2 text-xl font-semibold">
                              {thing?.name}
                            </div>
                            <div className="button-group mt-auto flex justify-between px-4">
                              <Button
                                type="primary"
                                className={`setting-button ${
                                  isDarkMode
                                    ? "dark:bg-darkButton dark:shadow-sm dark:shadow-white"
                                    : ""
                                }`}
                                icon={
                                  <SettingOutlined className="rotating-icon" />
                                }
                                onClick={() => handleSettingClick(thing.id)}
                              />
                              <Button
                                type="primary"
                                className="rounded-2xl font-semibold dark:bg-darkButton dark:shadow-md dark:shadow-white"
                                onClick={() =>
                                  navigate(`/chi-tiet-doi-tuong/${thing.id}`)
                                }
                              >
                                {translations["Quan sát"]}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Content>
              <div className="my-2 w-full border-b-2 border-gray-200 dark:border-blue-900"></div>
              {things.length > 0 && (
                <div className="mt-4 flex justify-center">
                  <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={filteredThings.length}
                    onChange={paginate}
                  />
                </div>
              )}
            </Layout>
          </div>
        </>
      )}
    </>
  );
};

export default ThingPage;
