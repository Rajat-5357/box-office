import React, { useReducer, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../misc/config';

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS': {
      return { isloading: false, error: null, show: action.show };
    }

    case 'FETCH_FAILED': {
      return { ...prevState, isloading: false, error: action.error };
    }

    default:
      return prevState;
  }
};

const initialState = {
  show: null,
  isloading: true,
  error: null,
};

const Show = () => {
  const { id } = useParams();

  const [{ show, isloading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [show, setShow] = useState(null);

  // const [isloading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    apiGet(`shows/${id}?embed[]=seasons&embed[]=cast`)
      .then(results => {
        setTimeout(() => {
          if (isMounted) {
            dispatch({ type: 'FETCH_SUCCESS', show: results });
          }
        }, 2000);
      })
      .catch(err => {
        if (isMounted) {
          dispatch({ type: 'FETCH_FAILED', error: err.message });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  console.log(show);
  if (isloading) {
    return <div>Data is Loading</div>;
  }

  if (error) {
    return <div>Error occured</div>;
  }

  return <div>this is show</div>;
};

export default Show;
