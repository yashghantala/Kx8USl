function UserCard({ userChanged }) {
    return (
        <div className="users-selection card">
            <div className="title">Choose User:</div>
            <div className="content">
                <input type="radio" onChange={userChanged} defaultChecked name="user_id" htmlFor="user_id" id="one" value="1" />
                <input type="radio" onChange={userChanged} name="user_id" id="two" value="2" />
                <label htmlFor="one" className="box first">
                    <div className="plan">
                        <span className="circle"></span>
                        <span className="yearly">User 1</span>
                    </div>
                </label>
                <label htmlFor="two" className="box second">
                    <div className="plan">
                        <span className="circle"></span>
                        <span className="yearly">User 2</span>
                    </div>
                </label>
            </div>
        </div>
    )
}
export default UserCard;