import { FaStar } from "react-icons/fa";

export default function StarRow({ colour }: { colour: string }) {
  return (
    <div className={`flex w-full justify-between ${colour}`}>
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStar />
    </div>
  );
}
