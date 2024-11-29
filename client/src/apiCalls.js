import axios from "axios"

export const loginCall = async ( userCredentials, dispatch) => {
    const PA = import.meta.env.VITE_PUBLIC_API;
    dispatch({type: "LOGIN_START"})
    try {
        const res = await axios.post(`${PA}/api/auth/login`, userCredentials );
        dispatch({type: "LOGIN_SUCCESS", payload: res.data})
    } catch (error) {
        dispatch({type: "LOGIN_FAILURE", payload: error})
    }
}