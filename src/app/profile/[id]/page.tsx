export default function UserProfile({ params }: any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Profile</h1>
      <hr />
      <p>User profile page {params.id}</p>
    </div>
  );
}
