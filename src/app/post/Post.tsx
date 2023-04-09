import { postSelector, useGetPostsQuery } from "../../store/post/postAdvancedSlice"
import { useSelector } from "react-redux";

export const Post = () =>{
const { isLoading } = useGetPostsQuery();
const posts = useSelector(postSelector.selectAll);

return (
    <>
      {isLoading || posts?.map(single=>(
        <div key={single.id}>
        <h2>{single.title}</h2>
        <p>{single.desc}</p>
        </div>
      ))}
    </>
  )
}