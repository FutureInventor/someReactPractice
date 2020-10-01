import React, { createContext,Component } from "react";
import axios from 'axios'
export const MyContext = createContext();

const Axios = axios.create({
    baseURL: 'http://localhost/reactRouting/php_jwt'
});

class MyContextProvider extends Component{
    constructor(){
        super();
        this.isLoggedIn();
    }

    //rootState
    state = {
        isAuth:false,
        theUser:null,
        users:false,
        regState:false,
        listState:false
    }

    //updating data from the superAdmin account
    updateData = ( id, name, email, type ) => {
        Axios.post('editUser.php',
        {
            id:id,
            name:name,
            email:email,
            type:type
        }).then(result => {
            console.log(result.data.user)
            this.setState({
                ...this.state,
                isAuth:true,
                theUser:result.data.user
            });
        })   
    }

    //getting users to list.js
    getUsers = () => {
        const data = this.state.users;
        return data;
    }

    //toggle between registration state and login
    toggleReg = () => {
        const regState = !this.state.regState;
        this.setState({
            ...this.state,
            regState,
            users: true
        })
    }

    //toggle between list and tree component
    toggleList = async () => {
        const listState = !this.state.listState;
        await Axios.get(`userList.php`,
        { timeout: 1000 })
        .then(res => {
          const data = res.data;
          this.setState({ 
            ...this.state,  
            users: data
           });
        })
        this.setState({
            ...this.state,
            listState:listState
        })
    }

    //logging out
    logoutUser = async (id) => {
        localStorage.removeItem('loginToken');
        this.setState({
            ...this.state,
            isAuth:false
        })
        await Axios.post('logout.php', {
            id:id
        })
    }

    //sending the user registration request
    registerUser = async (user) => {
        const register = await Axios.post('register.php',{
            name:user.name,
            email:user.email,
            password:user.password 
        });

        return register.data;
    }

    //sending the user Login request
    loginUser = async (user) => {
        const login = await Axios.post('login.php',{
            email:user.email,
            password:user.password
        })
        this.setState({
            ...this.state,
            listState:false
        })
        return login.data;
    }

    //checking if user is logged in or not
    isLoggedIn = async () => {
        const loginToken = localStorage.getItem('loginToken');

        //if the local-storage has the JWT token
        if(loginToken){

            //adding JWT token to axios default header
            Axios.defaults.headers.common['Authorization'] = 'bearer '+loginToken;

            //fetching the user information
            const {data} = await Axios.get('user-info.php');

            //if user information is successfully received
            if(data.success && data.user){
                this.setState({
                    ...this.state,
                    isAuth:true,
                    theUser:data.user
                });
            }
        }
    }

    //data used outside
    render(){
        const contextValue = {
            rootState:this.state,
            updateData:this.updateData,
            getUsers:this.getUsers,
            toggleList:this.toggleList,
            toggleReg:this.toggleReg,
            isLoggedIn:this.isLoggedIn,
            registerUser:this.registerUser,
            loginUser:this.loginUser,
            logoutUser:this.logoutUser
        }
        return(
            <MyContext.Provider value={contextValue}>
                {this.props.children}
            </MyContext.Provider>
        )
    }

}

export default MyContextProvider;