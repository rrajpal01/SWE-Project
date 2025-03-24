import React from 'react'
import './SignUp.css';
import alligator from '../Assets/alligator.png';

const SignUp = () => {
  return (
    <div className="SignUpContainer">
        <div className="Image"><img src={alligator} alt="Alligator" className = "Icon"/></div>
        <div className="box-1">
            <div className="WelcomeMsg">Welcome to Swamp Stays – Find your perfect stay today!</div>
        </div>

        <div className="box-2">
            <div className="box-2Margins">
                <div className="Title">Create Account</div>
                <div className="inputs">
                        <div className="SmallInputs">
                            <div className="FirstInput">
                                <text className="InputText">First Name</text>
                                <input type="First Name" />
                            </div>
                            <div className="LastInput">
                                <text className="InputText">Last Name</text>
                                <input type="Last Name" />
                            </div>
                        </div>
                        <div className="BigInputs">
                            <div className="EmailInput">
                                <text className="InputText">Email</text>
                                <input type="Email" />
                            </div>
                            <div className="PassInput">
                                <text className="InputText">Password</text>
                                <input type="Password" />
                            </div>
                        </div>
                </div>
                <div className="button">
                    <text>Create Account</text>
                </div>
                <text className="ButtonCaption">Already have an account? <text className="LoginLink">Login</text></text>
            </div>
        </div>
    </div>
  )
}

export default SignUp
