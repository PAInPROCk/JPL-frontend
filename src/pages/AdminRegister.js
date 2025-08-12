import "./AdminRegister.css";

const AdminRegister = () => {
    return (
        <>
            <div className="register-bg">
                <div className="container player-info-container shadow p-4 rounded">
                    <div className="row g-4">
                        {/* Player Image */}
                        <div className="col-md-3 text-center">
                            <img
                                
                                
                            />
                        </div>

                        {/* Player Details */}
                        <div className="col-md-9">
                            <div className="row g-3">
                                <div className="col-md-6 info-box green">
                                    <div className="label">Player Name</div>
                                    <div className="value"><input className="border-0" type="text"></input></div>
                                </div>
                                <div className="col-md-3 info-box green">
                                    <div className="label">Jersey No</div>
                                    <div className="value p-1"><input className="border-0" type="text"></input></div>
                                </div>
                                <div className="col-md-3 info-box green">
                                    <div className="label">Nick Name</div>
                                    <div className="value p-1"><input className="border-0" type="text"></input></div>
                                </div>

                                <div className="col-md-6 info-box red">
                                    <div className="label">Player Category</div>
                                    <div className="value p-1"><input className="border-0" type="text"></input></div>
                                </div>
                                <div className="col-md-6 info-box red">
                                    <div className="label">Type</div>
                                    <div className="value"><input className="border-0" type="text"></input></div>
                                </div>

                                {/* Stats */}
                                <div className="col-md-3 stat-box orange">
                                    <div className="label">Total Runs</div>
                                    <div className="value"></div>
                                </div>
                                <div className="col-md-3 stat-box orange">
                                    <div className="label">Highest Runs</div>
                                    <div className="value"></div>
                                </div>
                                <div className="col-md-3 stat-box orange">
                                    <div className="label">Wickets Taken</div>
                                    <div className="value"></div>
                                </div>
                                <div className="col-md-3 stat-box orange">
                                    <div className="label">Being Out</div>
                                    <div className="value"></div>
                                </div>

                                {/* Teams */}
                                <div className="col-12 team-box">
                                    <div className="label bg-primary text-white p-2 rounded">
                                        Played for Teams
                                    </div>
                                    <div className="d-flex gap-3 mt-2 flex-wrap">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminRegister