import { FC, FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";

interface MemberFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  memberNumber: string;
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
  memberNumber: string;
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

const AddMember: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormError[]>([]);
  const [updateErrors, setUpdateErrors] = useState<FormError[]>([]);
  const [deleteError, setDeleteError] = useState("");
  const [fileData, setFileData] = useState<any[]>([]);
  const [fileErrors, setFileErrors] = useState<any[]>([]);

  const [formData, setFormData] = useState<MemberFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    memberNumber: "",
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
    memberNumber: "",
    membershipType: "Basic",
    paymentHistory: {
      amount: 0,
      paymentDate: new Date().toISOString().split("T")[0],
    },
  });

  const [deleteMemberNumber, setDeleteMemberNumber] = useState("");

  const membershipTypes = ["Basic", "Standard", "Premium", "Annual"];
  const genderTypes = ["Male", "Female", "Other"];

  const validateForm = (): FormError[] => {
    const errors: FormError[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const aadharRegex = /^\d{12}$/;

    if (!formData.name.trim())
      errors.push({ field: "name", message: "Name is required" });
    if (!formData.email.trim()) {
      errors.push({ field: "email", message: "Email is required" });
    } else if (!emailRegex.test(formData.email)) {
      errors.push({ field: "email", message: "Invalid email format" });
    }
    if (!formData.phone.trim()) {
      errors.push({ field: "phone", message: "Phone is required" });
    } else if (!phoneRegex.test(formData.phone)) {
      errors.push({
        field: "phone",
        message: "Invalid phone number (10 digits required)",
      });
    }
    if (!formData.address.trim())
      errors.push({ field: "address", message: "Address is required" });
    if (!formData.memberNumber.trim())
      errors.push({
        field: "memberNumber",
        message: "Member number is required",
      });
    if (!formData.aadharNumber.trim()) {
      errors.push({
        field: "aadharNumber",
        message: "Aadhar number is required",
      });
    } else if (!aadharRegex.test(formData.aadharNumber)) {
      errors.push({
        field: "aadharNumber",
        message: "Invalid Aadhar number (12 digits required)",
      });
    }
    if (!formData.emergencyContact.trim()) {
      errors.push({
        field: "emergencyContact",
        message: "Emergency contact is required",
      });
    } else if (!phoneRegex.test(formData.emergencyContact)) {
      errors.push({
        field: "emergencyContact",
        message: "Invalid emergency contact number",
      });
    }
    if (!formData.gender)
      errors.push({ field: "gender", message: "Gender is required" });
    if (!formData.dateOfBirth)
      errors.push({
        field: "dateOfBirth",
        message: "Date of birth is required",
      });
    if (formData.paymentHistory[0].amount <= 0) {
      errors.push({
        field: "paymentHistory",
        message: "Payment amount must be greater than 0",
      });
    }

    return errors;
  };

  const validateUpdateForm = (): FormError[] => {
    const errors: FormError[] = [];
    if (!updateFormData.memberNumber.trim()) {
      errors.push({
        field: "memberNumber",
        message: "Member number is required",
      });
    }
    if (updateFormData.paymentHistory.amount <= 0) {
      errors.push({
        field: "paymentHistory",
        message: "Payment amount must be greater than 0",
      });
    }
    if (!updateFormData.paymentHistory.paymentDate) {
      errors.push({
        field: "paymentHistory",
        message: "Payment date is required",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "amount" || name === "paymentDate") {
      setUpdateFormData((prev) => ({
        ...prev,
        paymentHistory: {
          ...prev.paymentHistory,
          [name]: name === "amount" ? Number(value) : value,
        },
      }));
    } else {
      setUpdateFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteMemberNumber(e.target.value);
    setDeleteError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (formErrors.length > 0) return setErrors(formErrors);

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const response = await axios.post(
        "http://localhost:3000/api/gym/add-member",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Member added:", response.data);
      navigate("/dashboard/gym/members");
    } catch (error: any) {
      setErrors([
        {
          field: "name",
          message: error.response?.data?.message || "Error adding member",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formErrors = validateUpdateForm();
    if (formErrors.length > 0) return setUpdateErrors(formErrors);

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      await axios.put(
        "http://localhost:3000/api/gym/update-member",
        updateFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/dashboard/gym/members");
    } catch (error: any) {
      setUpdateErrors([
        {
          field: "name",
          message: error.response?.data?.message || "Error updating member",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    if (!deleteMemberNumber.trim())
      return setDeleteError("Seat number required");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      await axios.delete(
        `http://localhost:3000/api/gym/delete-member/${deleteMemberNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/dashboard/gym/members");
    } catch (error: any) {
      setDeleteError(error.response?.data?.message || "Error deleting member");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setFileData(parsedData);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileSubmit = async () => {
    if (fileData.length === 0)
      return setFileErrors([{ field: "file", message: "No file uploaded" }]);

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      await axios.post(
        "http://localhost:3000/api/gym/upload-members",
        fileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/dashboard/gym/members");
    } catch (error: any) {
      setFileErrors([
        {
          field: "upload",
          message: error.response?.data?.message || "Error uploading members",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-[#F0F0D7]">
      {/* Add Member Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#D0DDD0] p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-[#727D73] mb-6">
          Add New Member
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            />
            {errors.find((e) => e.field === "name") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((e) => e.field === "name")?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            />
            {errors.find((e) => e.field === "email") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((e) => e.field === "email")?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
              placeholder="10-digit number"
            />
            {errors.find((e) => e.field === "phone") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((e) => e.field === "phone")?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
              rows={3}
            />
            {errors.find((e) => e.field === "address") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((e) => e.field === "address")?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Member Number *
            </label>
            <input
              type="text"
              name="memberNumber"
              value={formData.memberNumber}
              onChange={handleChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            />
            {errors.find((e) => e.field === "memberNumber") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((e) => e.field === "memberNumber")?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Aadhar Number *
            </label>
            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
              placeholder="12-digit number"
            />
            {errors.find((e) => e.field === "aadharNumber") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((e) => e.field === "aadharNumber")?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Emergency Contact *
            </label>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
              placeholder="10-digit number"
            />
            {errors.find((e) => e.field === "emergencyContact") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((e) => e.field === "emergencyContact")?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            >
              <option value="">Select Gender</option>
              {genderTypes.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
            {errors.find((e) => e.field === "gender") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((e) => e.field === "gender")?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            />
            {errors.find((e) => e.field === "dateOfBirth") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((e) => e.field === "dateOfBirth")?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Membership Type *
            </label>
            <select
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            >
              {membershipTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Payment Amount *
            </label>
            <input
              type="number"
              name="amount"
              //value={formData.paymentHistory[0].amount}
              onChange={handlePaymentChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            />
            {errors.find((e) => e.field === "paymentHistory") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((e) => e.field === "paymentHistory")?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Payment Date *
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentHistory[0].paymentDate.split("T")[0]}
              onChange={handlePaymentChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 px-6 py-2 bg-[#727D73] text-white rounded-md hover:bg-[#AAB99A] transition-colors"
        >
          {loading ? "Adding..." : "Add Member"}
        </button>
      </form>

      {/* Update Member Form */}
      <form
        onSubmit={handleUpdateSubmit}
        className="bg-[#D0DDD0] p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-[#727D73] mb-6">
          Update Member
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Member Number *
            </label>
            <input
              type="text"
              name="memberNumber"
              value={updateFormData.memberNumber}
              onChange={handleUpdateChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            />
            {updateErrors.find((e) => e.field === "memberNumber") && (
              <p className="text-red-500 text-sm mt-1">
                {updateErrors.find((e) => e.field === "memberNumber")?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Membership Type *
            </label>
            <select
              name="membershipType"
              value={updateFormData.membershipType}
              onChange={handleUpdateChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            >
              {membershipTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Payment Amount *
            </label>
            <input
              type="number"
              name="amount"
              //value={updateFormData.paymentHistory.amount}
              onChange={handleUpdateChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            />
            {updateErrors.find((e) => e.field === "paymentHistory") && (
              <p className="text-red-500 text-sm mt-1">
                {
                  updateErrors.find((e) => e.field === "paymentHistory")
                    ?.message
                }
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Payment Date *
            </label>
            <input
              type="date"
              name="paymentDate"
              value={updateFormData.paymentHistory.paymentDate}
              onChange={handleUpdateChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 px-6 py-2 bg-[#727D73] text-white rounded-md hover:bg-[#AAB99A] transition-colors"
        >
          {loading ? "Updating..." : "Update Member"}
        </button>
      </form>

      {/* Delete Member Form */}
      <form
        onSubmit={handleDelete}
        className="bg-[#D0DDD0] p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-[#727D73] mb-6">
          Delete Member
        </h2>
        <div className="max-w-md">
          <div>
            <label className="block text-sm font-medium text-[#727D73]">
              Member Number *
            </label>
            <input
              type="text"
              value={deleteMemberNumber}
              onChange={handleDeleteChange}
              className=" mt-1 block w-full bg-[#D0DDD0] rounded-md p-2 focus:outline-none focus:border-[#727D73] focus:ring-2 focus:ring-[#727D73]"
            />
            {deleteError && (
              <p className="text-red-500 text-sm mt-1">{deleteError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {loading ? "Deleting..." : "Delete Member"}
          </button>
        </div>
      </form>

      {/* File Upload Section */}
      <div className="bg-[#D0DDD0] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-[#727D73] mb-6">
          Upload Members List
        </h2>
        <div className="max-w-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#727D73] mb-2">
              Upload Excel File (.xlsx, .xls)
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-[#727D73] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#727D73] file:text-white hover:file:bg-[#AAB99A]"
            />
          </div>

          <button
            type="button"
            onClick={handleFileSubmit}
            disabled={loading}
            className="px-6 py-2 bg-[#727D73] text-white rounded-md hover:bg-[#AAB99A] transition-colors"
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>

          {fileErrors.length > 0 && (
            <div className="mt-4 text-red-500">
              {fileErrors.map((error, index) => (
                <p key={index} className="text-sm">
                  {error.message}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMember;
