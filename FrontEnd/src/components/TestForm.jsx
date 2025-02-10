import { useForm } from "react-hook-form";
import axios from "axios";

const TestForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/test", data);
      console.log("Submitted Successfully:", response.data);
      // Redirect to results page or show confirmation
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      <label>Question 1: What is 2 + 2?</label>
      <input type="number" {...register("q1")} required />
      
      <label>Question 2: Solve for x: 3x = 9</label>
      <input type="number" {...register("q2")} required />

      <button type="submit" className="p-2 bg-blue-500 text-white">Submit</button>
    </form>
  );
};

export default TestForm;
