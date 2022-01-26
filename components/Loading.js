import { Circle } from 'better-react-spinkit';

export default function Loading() {
  return (
    <center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div>
        <img
          src='https://1000logos.net/wp-content/uploads/2016/10/AOL-symbol-1.jpg'
          alt=''
          style={{ marginBottom: 10 }}
          height={200}
        />

        <Circle color='blue' size={60} />
      </div>
    </center>
  );
}
