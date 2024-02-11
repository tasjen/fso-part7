import axios from 'axios';

const baseUrl = '/api/blogs';

const getToken = () => {
  return JSON.parse(localStorage.getItem('loggedUser')).token;
};

const getAll = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
};

const create = async (blogObject) => {
  const config = {
    headers: { Authorization: `Bearer ${getToken()}` },
  };
  const res = await axios.post(baseUrl, blogObject, config);
  return res.data;
};

const remove = async (blogObject) => {
  const config = {
    headers: { Authorization: `Bearer ${getToken()}` },
  };
  await axios.delete(`${baseUrl}/${blogObject.id}`, config);
  return blogObject.id;
};

const update = async (blogObject) => {
  const config = {
    headers: { Authorization: `Bearer ${getToken()}` },
  };
  const res = await axios.put(
    `${baseUrl}/${blogObject.id}`,
    blogObject,
    config
  );
  return res.data;
};

const addComment = async ({ blogId, comment }) => {
  const config = {
    headers: { Authorization: `Bearer ${getToken()}` },
  };
  const res = await axios.post(
    `${baseUrl}/${blogId}/comments`,
    { comment },
    config
  );
  return res.data;
};

export default { getToken, getAll, create, remove, update, addComment };
