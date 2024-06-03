# recommendation-backend

docker pull postgres

docker run --name my_postgres_container \
-e POSTGRES_USER=recuser \
-e POSTGRES_PASSWORD=recPa55w0rd \
-e POSTGRES_DB=recdb \
-v /Users/pyaephyo/vp/db:/var/lib/postgresql/data \
-p 5432:5432 \
-d postgres

{
  "name": "{{name}}",
  "gender": "{{gender}}",
  "location": "{{location}}",
  "university": "{{university}}",
  "interests": ["{{interest1}}", "{{interest2}}"],
  "password": "password123"
}
