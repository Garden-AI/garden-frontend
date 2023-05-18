import SearchWidget from "./api_demos/SearchWidget";

interface RealStuffProps {
  isAuthenticated: boolean;
  handleLogin: () => void;
  handleLogOut: () => void;
}

export default function RealStuff(props: RealStuffProps) {
    const {isAuthenticated, handleLogin, handleLogOut} = props
    return (
        <div className="app">
        <header className="app-header">
          <h1>Garden Dev Page</h1>
        </header>
        <main className="app-main">
          {!isAuthenticated && (
            <div>
              <button onClick={handleLogin}>Sign In using Globus Auth</button>
            </div>
          )}
          {isAuthenticated && (
            <div>
              <h1>Welcome!</h1>
              <button onClick={handleLogOut}>Log Out</button>
              <hr />
              <div>
                <SearchWidget/>
              </div>
            </div>
          )}
        </main>
      </div>
    )
}