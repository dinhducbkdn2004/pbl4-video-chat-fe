import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch';
import userApi from '../../apis/userApi';
import Loading from '../../components/Loading/Loading';

const UserPage = () => {
    const {id} = useParams();
    const [user , setUser ] = useState(null)
    const {isLoading, fetchData} = useFetch();
    useEffect(() => {
      (async () => {
        const data = fetchData(()=> userApi.getUser(id));
        console.log(data);
        if(data.ok){
            setUser(data.data)
        }
      })
    }, [id])
    console.log(user);
  return (
    <div>
      {isLoading ? <Loading /> : <h1>{user?.name}</h1>}
    </div>
  )
}

export default UserPage
