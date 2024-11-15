import CreatePost from "./createPost/cPost"
import Post from "./post/post"

function feed({ UserPhoto, mainItems, SeperatingLine }) {
  const { ShareOptions, Friends, Shares } = mainItems;
  return (
    <div className=" w-[calc(100%-700px)] items-center flex flex-col gap-10 overflow-x-hidden ">
      <CreatePost ShareOptions={ShareOptions} UserPhoto={UserPhoto} SeperatingLine={SeperatingLine} />
      <Post Shares={Shares} Friends={Friends} ShareOptions={ShareOptions} UserPhoto={UserPhoto} SeperatingLine={SeperatingLine} />
      <Post Shares={Shares} Friends={Friends} ShareOptions={ShareOptions} UserPhoto={UserPhoto} SeperatingLine={SeperatingLine} />
      <Post Shares={Shares} Friends={Friends} ShareOptions={ShareOptions} UserPhoto={UserPhoto} SeperatingLine={SeperatingLine} />
    </div>
  );
}

export default feed;
