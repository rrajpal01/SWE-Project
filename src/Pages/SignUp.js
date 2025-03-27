import React from 'react'
import './SignUp.css';
import alligator from '../Assets/gator.png';

const SignUp = () => {
  return (
    <div className="SignUpContainer">
        <div className="box-1">
            <div className="WelcomeMsg">
                <h1>Welcome to Swamp Stays</h1>
                <h1>-</h1>
                <h1>Find your perfect stay today!</h1>
            </div>
        </div>

        <div className="box-2">
                <h1 className="Title">Create Account</h1>
                <form className="inputs">
                        <div className="SmallInputs">
                            <div className="FirstInput">
                                <label className="InputText">First Name</label>
                                <input type="text" style={{width: "337px", height: "53px"}}/>
                            </div>
                            <div className="LastInput">
                                <label className="InputText">Last Name</label>
                                <input type="text" style={{width: "337px", height: "53px"}}/>
                            </div>
                        </div>
                        <div className="BigInputs">
                            <div className="EmailInput">
                                <label className="InputText">Email</label>
                                <input type="text" style={{width: "730px", height: "53px"}}/>
                            </div>
                            <div className="PassInput">
                                <label className="InputText">Password</label>
                                <input type="text" style={{width: "730px", height: "53px"}}/>
                            </div>
                        </div>
                </form>
                <div className="ButtonContainer">
                    <button className="button">
                        <label>Create Account</label>
                    </button>
                    <div className="ButtonCaption"><label>Already have an account? <label className="LoginLink">Login</label></label></div>
                </div>
        </div>
        <img src={alligator} alt="Alligator" className = "GatorImage"/>
    </div>
  )
}

export default SignUp
