import { useState, useEffect } from 'react';
import axios from 'axios';

export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

export const useResource = (url) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    axios.get(url)
    .then(res => setState(res.data))
    .catch(console.log)
  }, [url])

  return [state, setState]
}
