function friendList({ mainItems }) {
  const {Friends } = mainItems;
  return (
    <div>
      <ul className="flex justify-center items-start flex-col gap-3">
        {Friends.map((Friend) => (
          <li key={Friend.id} className="flex items-center gap-4">
            <img
              src={Friend.pic}
              alt={`${Friend.fname} ${Friend.lname}`}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="cursor-pointer text-black text-lg">{`${Friend.fname} ${Friend.lname}`}</p>
              <a href="#" className="cursor-pointer text-blue-500">
                View Profile
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default friendList;
