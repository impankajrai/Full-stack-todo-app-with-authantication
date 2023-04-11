import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';

//fetch all the todos according to user =========================================================
export const fetchTodos = createAsyncThunk(
	"fetchtodos/todos",
	async () => {
		const response = await fetch(
			`${process.env.REACT_APP_BACKEND_BASE_URL}/todo/fetch`,
			{
				method: "get",
				credentials: "include",
			}
		);
		const result = await response.json();
		if (result.success) {
			return result.todos;
		} else {
			return false;
		}
	}
);


//Create new todo =========================================================
export const createTodo = createAsyncThunk(
	"createTodo/todos",
	async (todo) => {

        const data={
            todo,
            status:"pending",
            id: uuidv4()
        }
		const response = await fetch(
			`${process.env.REACT_APP_BACKEND_BASE_URL}/todo/create`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(data),
				credentials: "include",
			}
		);
        const result = await response.json();
        return {success:result.success,message:result.message,data};
		
	}
);

//Update todo =========================================================
export const updateTodo = createAsyncThunk(
	"update/todos",
	async (data) => {
        console.log(data)

		const response = await fetch(
			`${process.env.REACT_APP_BACKEND_BASE_URL}/todo/update`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(data),
				credentials: "include",
			}
		);
        const result = await response.json();
        return {success:result.success,message:result.message,data};
		
	}
);

const todoSlice = createSlice({
	name: "auth",
	initialState:[],
	reducers: {},
    extraReducers:{
        [fetchTodos.fulfilled]: (state, {payload}) => {
            console.log(payload)
            payload.map(todo=>state.push(todo))
        },
        [createTodo.fulfilled]: (state, {payload}) => {
            if(payload.success){
                state.push(payload.data)
                toast.success(payload.message);
            }
        },
        [updateTodo.fulfilled]: (state, {payload}) => {
            console.log(payload)
            if(payload.success){
                state.forEach((items)=>{
                    if (items.id===payload.data.id) {
                      items.status=payload.data.status
                    }
                   })
                   toast.success(payload.message);
            }
        },
    }
})

export default todoSlice.reducer;