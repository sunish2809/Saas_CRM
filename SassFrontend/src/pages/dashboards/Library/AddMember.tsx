import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";

interface MemberFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  seatNumber: string;
  aadharNumber: string;
  emergencyContact: string;
  gender: string;
  dateOfBirth: string;
  membershipType: string;
  paymentHistory: {
    amount: number;
    paymentDate: string;
  }[];
}
interface UpdateFormData {
  seatNumber: string;
  membershipType: string;
  paymentHistory: {
    amount: number;
    paymentDate: string;
  };
}

interface FormError {
  field: keyof MemberFormData | keyof UpdateFormData;
  message: string;
}

const AddMember: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormError[]>([]);
  const [updateErrors, setUpdateErrors] = useState<FormError[]>([]);
  const [deleteError, SetDeleteError] = useState("");
  const [fileData, setFileData] = useState<any[]>([]);
  const [FileErrors, setFileErrors] = useState<any[]>([]);
  const [formData, setFormData] = useState<MemberFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    seatNumber: "",
    aadharNumber: "",
    emergencyContact: "",
    gender: "",
    dateOfBirth: "",
    membershipType: "Basic",
    paymentHistory: [
      {
        amount: 0,
        paymentDate: new Date().toISOString(),
      },
    ],
  });
  const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
    seatNumber: "",
    paymentHistory: {
      amount: 0,
      paymentDate: new Date().toISOString().split("T")[0],
    },
    membershipType: "Basic",
  });
  const [deleteSeatNumber, setDeleteSeatNumber] = useState("");

  const membershipTypes = ["Basic", "Standard", "Premium", "Annual"];
  const genderTypes = ["Male", "Female", "Other"];

  const validateForm = (): FormError[] => {
    const errors: FormError[] = [];

    // Required field validation
    Object.entries(formData).forEach(([key, value]) => {
      if (!value && key !== "paymentHistory") {
        errors.push({
          field: key as keyof MemberFormData,
          message: `${key.charAt(0).toUpperCase() + key.slice(1)} is required`,
        });
      }
    });

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address",
      });
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.push({
        field: "phone",
        message: "Please enter a valid 10-digit phone number",
      });
    }

    // Aadhar validation
    const aadharRegex = /^\d{12}$/;
    if (formData.aadharNumber && !aadharRegex.test(formData.aadharNumber)) {
      errors.push({
        field: "aadharNumber",
        message: "Please enter a valid 12-digit Aadhar number",
      });
    }

    return errors;
  };

  const validateUpdateForm = (): FormError[] => {
    const errors: FormError[] = [];

    if (!updateFormData.seatNumber) {
      errors.push({
        field: "seatNumber",
        message: "Seat number is required",
      });
    }

    if (
      !updateFormData.paymentHistory.amount ||
      updateFormData.paymentHistory.amount <= 0
    ) {
      errors.push({
        field: "paymentHistory",
        message: "Please enter a valid amount",
      });
    }

    if (!updateFormData.paymentHistory.paymentDate) {
      errors.push({
        field: "paymentHistory",
        message: "Payment date is required",
      });
    }
    if (!updateFormData.membershipType) {
      errors.push({
        field: "membershipType",
        message: "Membership type is required",
      });
    }

    return errors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "amount" || name === "paymentDate") {
      // Handle payment history fields
      setUpdateFormData((prev) => ({
        ...prev,
        paymentHistory: {
          ...prev.paymentHistory,
          [name]: name === "amount" ? Number(value) : value,
        },
      }));
    } else {
      // Handle other fields
      setUpdateFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDeleteChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDeleteSeatNumber(e.target.value);
  };
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deleteSeatNumber.trim()) {
      SetDeleteError("Seat number is required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/get-started");
        return;
      }

      const response = await axios.delete(
        `http://localhost:3000/api/library/delete-member/${deleteSeatNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Delete response:", response.data);
      // Optionally navigate or show a success message
      navigate("/dashboard/library/members"); // Redirect after successful deletion
    } catch (error: any) {
      console.error("Error deleting member:", error);
      SetDeleteError(
        error.response?.data?.message || "Failed to delete member"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      paymentHistory: [
        {
          ...prev.paymentHistory[0],
          [name]: name === "amount" ? Number(value) : value,
        },
      ],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/get-started");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/library/add-member",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Member added:", response.data);
      navigate("/dashboard/library/members");
    } catch (error: any) {
      console.error("Error adding member:", error);
      if (error.response?.status === 401) {
        navigate("/get-started");
      } else {
        setErrors([
          {
            field: "name",
            message:
              error.response?.data?.message ||
              "Failed to add member. Please try again.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const updateErrors = validateUpdateForm();
    if (updateErrors.length > 0) {
      setUpdateErrors(updateErrors);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/get-started");
        return;
      }
      const requestData = {
        seatNumber: updateFormData.seatNumber,
        paymentHistory: updateFormData.paymentHistory,
        membershipType: updateFormData.membershipType,
      };
      const response = await axios.put(
        "http://localhost:3000/api/library/update-member",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Member updated:", response.data);
      setUpdateFormData({
        seatNumber: "",
        paymentHistory: {
          amount: 0,
          paymentDate: new Date().toISOString().split("T")[0],
        },
        membershipType: "Basic",
      });
      navigate("/dashboard/library/members");
    } catch (error: any) {
      console.error("Error updating member:", error);
      if (error.response?.status === 401) {
        navigate("/get-started");
      } else {
        setUpdateErrors([
          {
            field: "seatNumber",
            message:
              error.response?.data?.message ||
              "Failed to update member. Please try again.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const transformToFormData = (data: any[]) => {
    console.log("data", data);

    // Transforming each record in the data array
    const transformedData = data.map((record: any) => ({
      
      name: record.name,
      email: record.email,
      phone: record.phone,
      address: record.address,
      seatNumber: record.seatNumber,
      aadharNumber: record.aadharNumber,
      emergencyContact: record.emergencyContact,
      gender: record.gender,
      dateOfBirth: record.dateOfBirth,
      membershipType: record.membershipType,
      // paymentHistory: [
      //   {
      //     amount: record.paymentHistory_amount || 0,
      //     paymentDate: record.paymentHistory_date || new Date().toISOString(),
      //   },
      // ],
      paymentHistory: record.paymentHistory.map((payment: any) => ({
        amount: payment.amount || 0,
        paymentDate: payment.paymentDate || new Date().toISOString(),
      })),
    }));

    return transformedData; // Return the new array
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      console.log("raw data from file", data); // Log raw file data
      if (data) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData: any[] = XLSX.utils.sheet_to_json(sheet);
        console.log("Parsed data:", parsedData); // Log parsed data
        setFileData(parsedData); // Update state
      }
    };
    reader.readAsBinaryString(file);
  };
  useEffect(() => {
    // console.log("Updated fileData:", fileData);
  }, [fileData]);

  const handleFileSubmit = async () => {
    if (fileData.length === 0) {
      setFileErrors([
        { field: "file", message: "Please upload a file first." },
      ]);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/get-started");
        return;
      }

      //const transformedData = transformToFormData(fileData);
      const transformedData = fileData

      console.log("transform", transformedData);
      const response = await axios.post(
        "http://localhost:3000/api/library/upload-members",
        transformedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Members added:", response.data);
      navigate("/dashboard/library/members");
    } catch (error: any) {
      console.error("Error adding members:", error);
      if (error.response?.status === 401) {
        navigate("/get-started");
      } else {
        setFileErrors([
          {
            field: "upload",
            message:
              error.response?.data?.message ||
              "Failed to upload library records. Please try again.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#727D73]">Add New Member</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block bg-[#D0DDD0] w-full rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
            {/* Add this below each input field */}
            {errors.find((error) => error.field === "name") && (
              <p className="mt-1 text-sm text-red-600">
                {errors.find((error) => error.field === "name")?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 bg-[#D0DDD0] block w-full rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
            {errors.find((error) => error.field === "email") && (
              <p className="mt-1 text-sm text-red-600">
                {errors.find((error) => error.field === "email")?.message}
              </p>
            )}
          </div>

          {/* Add other form fields similarly */}
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit phone number"
              className="mt-1 bg-[#D0DDD0] block w-full rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
            {errors.find((error) => error.field === "phone") && (
              <p className="mt-1 text-sm text-red-600">
                {errors.find((error) => error.field === "phone")?.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="mt-1 bg-[#D0DDD0] block w-full rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
            {errors.find((error) => error.field === "address") && (
              <p className="mt-1 text-sm text-red-600">
                {errors.find((error) => error.field === "address")?.message}
              </p>
            )}
          </div>

          {/* Seat Number */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Seat Number
            </label>
            <input
              type="text"
              name="seatNumber"
              value={formData.seatNumber}
              onChange={handleChange}
              placeholder="e.g., 1, 2 ,101.."
              className="mt-1 bg-[#D0DDD0] block w-full rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
            {errors.find((error) => error.field === "seatNumber") && (
              <p className="mt-1 text-sm text-red-600">
                {errors.find((error) => error.field === "seatNumber")?.message}
              </p>
            )}
          </div>

          {/* Aadhar Number */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Aadhar Number
            </label>
            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              placeholder="12-digit Aadhar number"
              className="mt-1 bg-[#D0DDD0] block w-full rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
            {errors.find((error) => error.field === "aadharNumber") && (
              <p className="mt-1 text-sm text-red-600">
                {
                  errors.find((error) => error.field === "aadharNumber")
                    ?.message
                }
              </p>
            )}
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Emergency Contact
            </label>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="10-digit phone number"
              className="mt-1 bg-[#D0DDD0] block w-full rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
            {errors.find((error) => error.field === "emergencyContact") && (
              <p className="mt-1 text-sm text-red-600">
                {
                  errors.find((error) => error.field === "emergencyContact")
                    ?.message
                }
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 text-[#727D73] bg-[#D0DDD0] block w-full h-10 p-1 rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            >
              <option  value="">Select Gender</option>
              {genderTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.find((error) => error.field === "gender") && (
              <p className="mt-1 text-sm text-red-600">
                {errors.find((error) => error.field === "gender")?.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="mt-1 text-[#727D73] bg-[#D0DDD0] block w-full rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
            {errors.find((error) => error.field === "dateOfBirth") && (
              <p className="mt-1 text-sm text-red-600">
                {errors.find((error) => error.field === "dateOfBirth")?.message}
              </p>
            )}
          </div>

          {/* Membership Type */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Membership Type
            </label>
            <select
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
              className="mt-1 block text-[#727D73] bg-[#D0DDD0] w-full h-10 p-1 rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            >
              {membershipTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.find((error) => error.field === "membershipType") && (
              <p className="mt-1 text-sm text-red-600">
                {
                  errors.find((error) => error.field === "membershipType")
                    ?.message
                }
              </p>
            )}
          </div>

          {/* Payment Amount */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Payment Amount
            </label>
            <input
              type="number"
              name="amount"
              //value={formData.paymentHistory[0].amount}
              onChange={handlePaymentChange}
              min="0"
              // step="1"
              className="mt-1 bg-[#D0DDD0] block w-full rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
            {errors.find((error) => error.field === "paymentHistory") && (
              <p className="mt-1 text-sm text-red-600">
                {
                  errors.find((error) => error.field === "paymentHistory")
                    ?.message
                }
              </p>
            )}
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Payment Date
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentHistory[0].paymentDate.split("T")[0]}
              onChange={handlePaymentChange}
              className="mt-1 text-[#727D73] block bg-[#D0DDD0] w-full rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 p-4 rounded-md">
            {errors.map((error, index) => (
              <p key={index} className="text-red-600">
                {error.message}
              </p>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#727D73] text-white rounded-md hover:bg-[#AAB99A] focus:outline-none focus:ring-2 focus:ring-[#727D73] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </form>

      <form onSubmit={handleUpdateSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-[#727D73] mb-6">Update Member</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seat Number */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Seat Number
            </label>
            <input
              type="text"
              name="seatNumber"
              value={updateFormData.seatNumber}
              onChange={handleUpdateChange}
              className="mt-1 block w-full bg-[#D0DDD0] rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
          </div>

          {/* Payment Amount - Fix the value binding */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Payment Amount
            </label>
            <input
              type="number"
              name="amount"
              //value={updateFormData.paymentHistory.amount} // Fix this line
              onChange={handleUpdateChange}
              min="0"
              className="mt-1 block w-full bg-[#D0DDD0] rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Payment Date
            </label>
            <input
              type="date"
              name="paymentDate"
              value={updateFormData.paymentHistory.paymentDate}
              onChange={handleUpdateChange}
              className="mt-1 text-[#727D73] block bg-[#D0DDD0] w-full rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            />
          </div>

          {/* Membership Type */}
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Membership Type
            </label>
            <select
              name="membershipType"
              value={updateFormData.membershipType}
              onChange={handleUpdateChange}
              className="mt-1 text-[#727D73] block w-full bg-[#D0DDD0] h-10 p-1 rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
            >
              {membershipTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Messages */}
        {updateErrors.length > 0 && (
          <div className="bg-red-50 p-4 rounded-md">
            {updateErrors.map((error, index) => (
              <p key={index} className="text-red-600">
                {error.message}
              </p>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#727D73] text-white rounded-md hover:bg-[#AAB99A] focus:outline-none focus:ring-2 focus:ring-[#727D73] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Member"}
          </button>
        </div>
      </form>

      <form className="space-y-6" onSubmit={handleDelete}>
        <h2 className="text-2xl font-bold text-[#727D73] mb-6">Delete Member</h2>
        <div>
          <label className="block text-sm font-medium text-[#727D73]">
            Seat Number
          </label>
          <input
            type="text"
            name="seatNumber"
            value={deleteSeatNumber}
            onChange={handleDeleteChange}
            className="mt-1 block w-full bg-[#D0DDD0] rounded-md border-gray-300 shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
          />
        </div>

        <div className="flex justify-end mt-5">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Member"}
          </button>
        </div>
      </form>

      <div className="space-y-6  p-2 m-2 h-32 bg-[#D0DDD0] shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-[#727D73] mb-2">Upload Library Members</h2>

        <div>
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-[#727D73]"
          >
            Upload File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="mt-1 block w-full rounded-md border-[#727D73] shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleFileSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[#727D73] text-white rounded-md hover:bg-[#AAB99A] focus:outline-none focus:ring-2 focus:ring-[#727D73] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </div>

        {FileErrors.length > 0 && (
          <div className="mt-4">
            {FileErrors.map((error, index) => (
              <p key={index} className="text-sm text-red-600">
                {error.message}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMember;
