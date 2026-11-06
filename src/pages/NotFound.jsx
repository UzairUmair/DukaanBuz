import { Link } from 'react-router-dom';
import StateMessage from '../components/common/StateMessage.jsx';
export default function NotFound() { return <main className="container"><StateMessage title="This page does not exist" message="Check the address or return to the DukaanSaz homepage." action={<Link className="btn" to="/">Go to DukaanSaz</Link>} /></main>; }
