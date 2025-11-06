'use client';

import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaFacebookF, FaTwitter, FaGoogle, FaLinkedinIn, FaCar, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import styles from './auth.module.css';
import Image from 'next/image';

export default function AuthForm() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    carMake: "",
    carModel: "",
    carYear: "",
    licensePlate: "",
    serviceType: "",
    preferredDate: "",
    preferredTime: "",
    additionalServices: [],
    notes: "",
    termsAccepted: false,
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setActiveTab(0); // Reset to first tab when toggling
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isSignUpMode) {
      if (!formData.username.trim()) newErrors.username = "Username is required";
      if (!formData.password.trim()) newErrors.password = "Password is required";
      else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    } else {
      if (!formData.username.trim()) newErrors.username = "Username is required";
      if (!formData.password.trim()) newErrors.password = "Password is required";
    }

    if (activeTab === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }

    if (activeTab === 1) {
      if (!formData.carMake.trim()) newErrors.carMake = "Car make is required";
      if (!formData.carModel.trim()) newErrors.carModel = "Car model is required";
      if (!formData.carYear.trim()) newErrors.carYear = "Car year is required";
      if (!formData.licensePlate.trim()) newErrors.licensePlate = "License plate is required";
    }

    if (activeTab === 2) {
      if (!formData.serviceType) newErrors.serviceType = "Service type is required";
      if (!formData.preferredDate) newErrors.preferredDate = "Preferred date is required";
      if (!formData.preferredTime) newErrors.preferredTime = "Preferred time is required";
      if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const endpoint = isSignUpMode ? "/api/signup" : "/api/login";
        const response = await axios.post(endpoint, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          toast.success(isSignUpMode ? "Account created successfully!" : "Logged in successfully!");
          // Reset form or redirect as needed
        } else {
          toast.error(response.data.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const canProceed = () => {
    if (activeTab === 0) {
      return formData.firstName && formData.lastName && formData.email && formData.phone;
    }
    if (activeTab === 1) {
      return formData.carMake && formData.carModel && formData.carYear && formData.licensePlate;
    }
    return true;
  };

  const nextTab = () => {
    if (validateForm()) {
      setActiveTab(prev => prev + 1);
    }
  };

  const prevTab = () => {
    setActiveTab(prev => prev - 1);
  };

  const renderInput = (label, id, type = "text", icon = null) => (
    <div className={styles.inputField}>
      {icon && <i className={styles.icon}>{icon}</i>}
      <input
        type={type}
        placeholder={label}
        value={formData[id]}
        onChange={(e) => handleInputChange(id, e.target.value)}
        className={errors[id] ? styles.errorInput : ''}
      />
      {errors[id] && <p className={styles.errorText}>{errors[id]}</p>}
    </div>
  );

  return (
    <div className={`${styles.container} ${isSignUpMode ? styles.signUpMode : ''}`}>
      <Toaster position="top-center" />
      
      <div className={styles.formsContainer}>
        <div className={styles.signinSignup}>
          {/* Sign In Form */}
          <form className={`${styles.form} ${styles.signInForm}`} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <h2 className={styles.title}>Sign in</h2>
            {renderInput("Username", "username", "text", <FaUser />)}
            {renderInput("Password", "password", "password", <FaLock />)}
            <input type="submit" value="Login" className={`${styles.btn} ${styles.solid}`} />
            <p className={styles.socialText}>Or Sign in with social platforms</p>
            <div className={styles.socialMedia}>
              <a href="#" className={styles.socialIcon}><FaFacebookF /></a>
              <a href="#" className={styles.socialIcon}><FaTwitter /></a>
              <a href="#" className={styles.socialIcon}><FaGoogle /></a>
              <a href="#" className={styles.socialIcon}><FaLinkedinIn /></a>
            </div>
          </form>

          {/* Sign Up Form - Multi-step */}
          <form className={`${styles.form} ${styles.signUpForm}`} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <h2 className={styles.title}>Sign up</h2>
            
            {/* Progress Steps */}
            <div className={styles.progressSteps}>
              {['Personal', 'Vehicle', 'Service'].map((step, idx) => (
                <div 
                  key={idx}
                  className={`${styles.step} ${activeTab === idx ? styles.activeStep : ''} ${idx < activeTab ? styles.completedStep : ''}`}
                  onClick={() => idx <= activeTab && canProceed() && setActiveTab(idx)}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
            
            {/* Step 1: Personal Info */}
            {activeTab === 0 && (
              <div className={styles.formStep}>
                {renderInput("First Name", "firstName", "text", <FaUser />)}
                {renderInput("Last Name", "lastName", "text", <FaUser />)}
                {renderInput("Email", "email", "email", <FaEnvelope />)}
                {renderInput("Phone", "phone", "tel", <FaUser />)}
                {renderInput("Username", "username", "text", <FaUser />)}
                {renderInput("Password", "password", "password", <FaLock />)}
                {renderInput("Confirm Password", "confirmPassword", "password", <FaLock />)}
              </div>
            )}
            
            {/* Step 2: Vehicle Info */}
            {activeTab === 1 && (
              <div className={styles.formStep}>
                {renderInput("Car Make", "carMake", "text", <FaCar />)}
                {renderInput("Car Model", "carModel", "text", <FaCar />)}
                {renderInput("Car Year", "carYear", "text", <FaCar />)}
                {renderInput("License Plate", "licensePlate", "text", <FaCar />)}
              </div>
            )}
            
            {/* Step 3: Service Info */}
            {activeTab === 2 && (
              <div className={styles.formStep}>
                {renderInput("Service Type", "serviceType", "text", <FaUser />)}
                {renderInput("Preferred Date", "preferredDate", "date", <FaCalendarAlt />)}
                {renderInput("Preferred Time", "preferredTime", "time", <FaCalendarAlt />)}
                
                <div className={styles.checkboxGroup}>
                  <label>Additional Services:</label>
                  {["Car Wash", "Interior Cleaning", "Tire Rotation"].map(service => (
                    <label key={service} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.additionalServices.includes(service)}
                        onChange={(e) =>
                          handleInputChange(
                            "additionalServices",
                            e.target.checked
                              ? [...formData.additionalServices, service]
                              : formData.additionalServices.filter(s => s !== service)
                          )
                        }
                      />
                      {service}
                    </label>
                  ))}
                </div>
                
                <div className={styles.terms}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => handleInputChange("termsAccepted", e.target.checked)}
                    />
                    I accept the terms and conditions
                  </label>
                  {errors.termsAccepted && <p className={styles.errorText}>{errors.termsAccepted}</p>}
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className={styles.formNavigation}>
              {activeTab > 0 && (
                <button type="button" onClick={prevTab} className={styles.navButton}>
                  <FaChevronLeft /> Back
                </button>
              )}
              
              {activeTab < 2 ? (
                <button type="button" onClick={nextTab} className={styles.navButton} disabled={!canProceed()}>
                  Next <FaChevronRight />
                </button>
              ) : (
                <button type="submit" className={`${styles.btn} ${styles.solid}`}>
                  Complete Registration
                </button>
              )}
            </div>
            
            <p className={styles.socialText}>Or Sign up with social platforms</p>
            <div className={styles.socialMedia}>
              <a href="#" className={styles.socialIcon}><FaFacebookF /></a>
              <a href="#" className={styles.socialIcon}><FaTwitter /></a>
              <a href="#" className={styles.socialIcon}><FaGoogle /></a>
              <a href="#" className={styles.socialIcon}><FaLinkedinIn /></a>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.panelsContainer}>
        <div className={`${styles.panel} ${styles.leftPanel}`}>
          <div className={styles.content}>
            <h3>New to our community?</h3>
            <p>
              Discover a world of possibilities! Join us and explore a vibrant
              community where ideas flourish and connections thrive.
            </p>
            <button className={`${styles.btn} ${styles.transparent}`} onClick={toggleMode}>
              Sign up
            </button>
          </div>
          <Image
          width={100} height={100} quality={100} unoptimized={true} 
            src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png" 
            className={styles.image} 
            alt="Sign up illustration" 
          />
        </div>
        <div className={`${styles.panel} ${styles.rightPanel}`}>
          <div className={styles.content}>
            <h3>One of Our Valued Members</h3>
            <p>
              Thank you for being part of our community. Your presence enriches our
              shared experiences. Let's continue this journey together!
            </p>
            <button className={`${styles.btn} ${styles.transparent}`} onClick={toggleMode}>
              Sign in
            </button>
          </div>
          <Image
          width={100} height={100} quality={100} unoptimized={true} 
            src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png" 
            className={styles.image} 
            alt="Sign in illustration" 
          />
        </div>
      </div>
    </div>
  );
}