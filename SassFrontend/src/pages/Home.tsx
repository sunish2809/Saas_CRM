import { useNavigate } from 'react-router-dom';
import { BUSINESS_OPTIONS } from '../components/business';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to Our Management System</h1>
      <p>Choose your business type to get started</p>
      
      <div className="business-options">
        {BUSINESS_OPTIONS.map((business) => (
          <div key={business.id} className="business-card">
            <h2>{business.label}</h2>
            <p>{business.description}</p>
            <div className="button-group">
              <button onClick={() => navigate(`/signin?business=${business.id}`)}>
                Sign In 
              </button>
              <button onClick={() => navigate(`/signup?business=${business.id}`)}>
                Sign Up
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;