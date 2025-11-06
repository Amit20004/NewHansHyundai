"use client"
// import {  Shield, Car, Heart, Home } from "lucide-react"
// import { useState } from "react"
import Btn from '../../../components/ui/Button'
import InsuranceForm from '../../../components/form/InsuranceForm'
import ResponsiveBanner from "../../../components/banner/ResponsiveBanner"



export default function HyundaiInsuranceCards() {

    return (
        <>
        <ResponsiveBanner/>
        <center><h1>
          Get your car Insured.
        </h1></center>

                    <InsuranceForm/>

      <div className=" bg-gray-50 py-5  max-w-[1400px] w-full mx-auto">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Essential Cover Card */}
      <div className="bg-white  border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Essential Cover</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-gray-700">• All Consumables Covered</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No IDV Negotiations</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No Salvage Deductions</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No Spot Survey</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No FIR</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Electrical Parts Covered As Other Parts</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No Limit On Claims</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Cashless Facilities @300+ Dealer Locations</span>
          </li>
        </ul>
        <div className="mt-5 flex justify-center align-middle">
            <Btn btnName={"Enquiry Now"}/>
        </div>
      </div>

      {/* Advance Cover Card */}
      <div className="bg-white  border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Advance Cover</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-gray-700">• Nil Depreciation Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• All Consumables Covered</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No IDV Negotiations</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No Salvage Deductions</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No Spot Survey</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No FIR</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Electrical Parts Covered As Other Parts</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No Limit On Claims and other things</span>
          </li>
        </ul>
       <div className="mt-5 flex justify-center align-middle">
            <Btn btnName={"Enquiry Now"}/>
        </div>
      </div>

      {/* Premium Cover Card */}
      <div className="bg-white  border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Premium Cover</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-gray-700">• Nil Depreciation Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Engine Protect Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Key Protect Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Tyre & Alloy Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Nil Depreciation Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• All Consumables Covered</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No IDV Negotiations</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No Salvage Deductions</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• No Spot Survey</span>
          </li>
        </ul>
       <div className="mt-5 flex justify-center align-middle">
            <Btn btnName={"Enquiry Now"}/>
        </div>
      </div>

      {/* Luxury Cover Card */}
      <div className="bg-white  border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Luxury Cover</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-gray-700">• Inconvenience Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• High Value PA Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Personal Belongings Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Nil Depreciation Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Engine Protect Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Key Protect Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Tyre & Alloy Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• Nil Depreciation Cover</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-700">• All Consumables Covered</span>
          </li>
        </ul>
      <div className="mt-5 flex justify-center align-middle">
            <Btn btnName={"Enquiry Now"}/>
        </div>
      </div>
    </div>
  </div>
</div>
        </>
    )
}
