import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

//fetch already loggedin user (by cookies) =========================================================
export const fetchLoggedInUser = createAsyncThunk(
	"fetchloggedin/user",
	async () => {
		const response = await fetch(
			`${process.env.REACT_APP_BACKEND_BASE_URL}/user/isauth`,
			{
				method: "post",
				credentials: "include",
			}
		);
		const result = await response.json();
		if (result.success) {
			return result.user;
		} else {
			return false;
		}
	}
);

//login user =======================================================================================
export const login = createAsyncThunk("login", async (user) => {
	const { email, password } = user;
	const res = await fetch(
		`${process.env.REACT_APP_BACKEND_BASE_URL}/user/signin`,
		{
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ email, password }),
		}
	);
	const response = await res.json();
	if (response.success) {
		toast.success(response.message);
		return response.user;
	} else {
		toast.error(response.message);
		return null;
	}
});

//update user ========================================================================================================
export const updateUser = createAsyncThunk("updateUser", async (value) => {
	const response = await fetch(
		`${process.env.REACT_APP_BACKEND_BASE_URL}/user/update`,
		{
			method: "post",
			headers: {
				// "Content-Type": "application/json",  ///remove this line for formdata upload
				Accept: "application/json",
			},
			body: value,
			credentials: "include",
		}
	);

	const result = await response.json();
	if (result.success) {
		toast.success(result.message);
	} else {
		toast.error(result.message);
	}

	return result.user;
});


//Change password ========================================================================================================
export const changePassword = createAsyncThunk(
	"user/changepassword",
	async ({ oldPassword, newPassword }) => {
		const response = await fetch(
			`${process.env.REACT_APP_BACKEND_BASE_URL}/user/changepassword`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ oldPassword, newPassword }),
				credentials: "include",
			}
		);

		const result = await response.json();
		return { success: result.success, message: result.message };
	}
);
//Change password ========================================================================================================
export const logout = createAsyncThunk("user/logout",async () => {
		const response = await fetch(
			`${process.env.REACT_APP_BACKEND_BASE_URL}/user/logout`,
			{
				method: "get",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				credentials: "include",
			}
		);

		const result = await response.json();
		return { success: result.success, message: result.message };
	}
);

// functions =====================================================================================================
const insertIntoState = (state, action) => {
	const { id, name, email, photo } = action.payload;
	state.id = id;
	state.name = name;
	state.email = email;
	state.photo = photo;
};

const clearState = (state) => {
	state.id = "";
	state.name = "";
	state.email = "";
	state.photo = "";
};

//************************ slices ************************ */
const initialState = { id: "", name: "", email: "", photo: "" };
//slice start
const Authantication = createSlice({
	name: "auth",
	initialState,
	reducers: {},

	//extra reducer use for manage async request
	extraReducers: (builder) => {
		builder.addCase(fetchLoggedInUser.fulfilled, insertIntoState);
		builder.addCase(
			fetchLoggedInUser.rejected,
			(state, action) => (state = { ...state })
		);
		builder.addCase(login.fulfilled, insertIntoState);

		builder.addCase(
			updateUser.fulfilled,
			(state, action) => action.payload && insertIntoState(state, action)
		);

		builder.addCase(changePassword.fulfilled, (state, { payload }) => {
			if (payload.success) {
				toast.success(payload.message);
				clearState(state);
			} else toast.error(payload.message);
		});

		builder.addCase(logout.fulfilled, (state, { payload }) => {
			if (payload.success) {
				toast.success(payload.message);
				clearState(state);
			} else toast.error(payload.message);
		});
	},
});
export default Authantication.reducer;
