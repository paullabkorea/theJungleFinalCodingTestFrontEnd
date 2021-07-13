const baseURL = "http://localhost:3000/files/:nodeID";

const fetchObjects = async (nodeID = "") => {
  const changeNodeID = new RegExp(/:nodeID$/);
  const requestURL = baseURL.replace(changeNodeID, nodeID);

  try {
    const response = await fetch(requestURL);
    const responseBody = await response.json();

    return responseBody;
  } catch (error) {
    window.alert("API 서버에 문제가 발생했습니다.");
  }
};

export {
  fetchObjects,
};
