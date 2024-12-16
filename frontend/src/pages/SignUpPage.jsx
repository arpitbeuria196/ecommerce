import { UserPlus,Mail,Lock,User,ArrowRight,Loader } from "lucide-react"
import { useState } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const SignUpPage = () => {
  const loading = true;
  const[formData,setFormData] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
  })


  return (
    <div
    style={{
      height: "100vh",
      color: "white",
      fontSize: "2rem",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    >
      SignUp
    </div>
  )
}

export default SignUpPage
