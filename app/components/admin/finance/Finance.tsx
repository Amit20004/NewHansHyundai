import { CreditCard, Plus, Edit, Trash2, Save, Eye, Calculator, TrendingUp } from "lucide-react"

interface FinanceProps {
  activeTab?: string
}

export default function Finance({ activeTab = "Finance" }: FinanceProps) {
  const loanApplications = [
    {
      id: 1,
      customerName: "Rajesh Kumar",
      email: "rajesh@email.com",
      phone: "+91 98765 43210",
      vehicleModel: "Toyota Camry",
      loanAmount: "₹25,00,000",
      status: "Under Review",
      appliedDate: "2024-01-15",
      creditScore: 750,
    },
    {
      id: 2,
      customerName: "Priya Sharma",
      email: "priya@email.com",
      phone: "+91 87654 32109",
      vehicleModel: "Toyota Innova",
      loanAmount: "₹18,00,000",
      status: "Approved",
      appliedDate: "2024-01-12",
      creditScore: 780,
    },
    {
      id: 3,
      customerName: "Amit Patel",
      email: "amit@email.com",
      phone: "+91 76543 21098",
      vehicleModel: "Toyota Fortuner",
      loanAmount: "₹35,00,000",
      status: "Pending Documents",
      appliedDate: "2024-01-10",
      creditScore: 720,
    },
  ]

  const financeOptions = [
    {
      id: 1,
      name: "Standard Auto Loan",
      interestRate: "8.5%",
      tenure: "1-7 years",
      minAmount: "₹1,00,000",
      maxAmount: "₹50,00,000",
      processingFee: "1%",
      status: "Active",
    },
    {
      id: 2,
      name: "Premium Finance",
      interestRate: "7.9%",
      tenure: "1-5 years",
      minAmount: "₹5,00,000",
      maxAmount: "₹1,00,00,000",
      processingFee: "0.5%",
      status: "Active",
    },
    {
      id: 3,
      name: "Quick Approval Loan",
      interestRate: "9.2%",
      tenure: "1-3 years",
      minAmount: "₹50,000",
      maxAmount: "₹25,00,000",
      processingFee: "1.5%",
      status: "Active",
    },
  ]

  if (activeTab === "Loan Applications") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Loan Applications</h2>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-blue-600">{loanApplications.length}</h3>
              <p className="text-sm text-gray-600">Total Applications</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-green-600">
                {loanApplications.filter((app) => app.status === "Approved").length}
              </h3>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-yellow-600">
                {loanApplications.filter((app) => app.status === "Under Review").length}
              </h3>
              <p className="text-sm text-gray-600">Under Review</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-orange-600">
                {loanApplications.filter((app) => app.status === "Pending Documents").length}
              </h3>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Vehicle</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Loan Amount</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Credit Score</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Applied Date</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loanApplications.map((application) => (
                    <tr key={application.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-2">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{application.customerName}</div>
                          <div className="text-xs text-gray-500">{application.email}</div>
                          <div className="text-xs text-gray-500">{application.phone}</div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-sm text-gray-600">{application.vehicleModel}</td>
                      <td className="py-4 px-2 text-sm font-semibold text-gray-900">{application.loanAmount}</td>
                      <td className="py-4 px-2">
                        <span
                          className={`text-sm font-medium ${
                            application.creditScore >= 750
                              ? "text-green-600"
                              : application.creditScore >= 700
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {application.creditScore}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            application.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : application.status === "Under Review"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-sm text-gray-600">{application.appliedDate}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <button className="h-8 w-8 p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded flex items-center justify-center">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="h-8 w-8 p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded flex items-center justify-center">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === "Finance Options") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Finance Options</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Finance Option
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financeOptions.map((option) => (
            <div
              key={option.id}
              className="hover:shadow-lg transition-shadow bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{option.name}</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {option.status}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interest Rate:</span>
                  <span className="text-sm font-semibold text-blue-600">{option.interestRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tenure:</span>
                  <span className="text-sm font-medium">{option.tenure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount Range:</span>
                  <span className="text-sm font-medium">
                    {option.minAmount} - {option.maxAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Processing Fee:</span>
                  <span className="text-sm font-medium">{option.processingFee}</span>
                </div>
                <div className="flex items-center gap-2 pt-3">
                  <button className="h-8 w-8 p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded flex items-center justify-center">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="h-8 w-8 p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded flex items-center justify-center">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="h-8 w-8 p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded flex items-center justify-center text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activeTab === "EMI Calculator") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">EMI Calculator</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculate EMI
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (₹)</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  placeholder="1000000"
                  defaultValue="1000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (% per annum)</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  step="0.1"
                  placeholder="8.5"
                  defaultValue="8.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Tenure (Years)</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  placeholder="5"
                  defaultValue="5"
                />
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <Calculator className="h-4 w-4" />
                Calculate EMI
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">EMI Calculation Result</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <h3 className="text-2xl font-bold text-blue-600">₹20,276</h3>
                <p className="text-sm text-gray-600">Monthly EMI</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Principal Amount:</span>
                  <span className="text-sm font-semibold">₹10,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Interest:</span>
                  <span className="text-sm font-semibold">₹2,16,560</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="text-sm font-semibold">₹12,16,560</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loan Tenure:</span>
                  <span className="text-sm font-semibold">5 Years (60 months)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">EMI Calculator Settings</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Interest Rate (%)</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  step="0.1"
                  defaultValue="8.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Loan Amount (₹)</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  defaultValue="5000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Loan Amount (₹)</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  defaultValue="100000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Tenure (Years)</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  defaultValue="7"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              <label className="text-sm text-gray-700">Show EMI calculator on website</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              <label className="text-sm text-gray-700">Allow customers to save calculations</label>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Finance Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Finance Option
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{loanApplications.length}</h3>
            <p className="text-sm text-gray-600">Loan Applications</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{financeOptions.length}</h3>
            <p className="text-sm text-gray-600">Finance Options</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-4">
              <Calculator className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">8.5%</h3>
            <p className="text-sm text-gray-600">Avg. Interest Rate</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Loan Applications</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {loanApplications.slice(0, 3).map((application) => (
                <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{application.customerName}</div>
                    <div className="text-xs text-gray-500">
                      {application.vehicleModel} • {application.loanAmount}
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      application.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : application.status === "Under Review"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Finance Options</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {financeOptions.slice(0, 3).map((option) => (
                <div key={option.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{option.name}</div>
                    <div className="text-xs text-gray-500">
                      Rate: {option.interestRate} • Tenure: {option.tenure}
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {option.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
