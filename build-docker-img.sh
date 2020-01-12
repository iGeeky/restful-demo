if [ "$#" == "0" ]; then
  echo "Usage: sh $0 TAG"
  echo "\tTAG: 1.2.3"
  exit 1
fi

TAG="$1"
echo "BUILD TAG: $TAG"
cd ./console && npm run build:prod && cd ../

docker build -t igeeky/restful-demo:$TAG -f ./server/Dockerfile ./server
docker build -t igeeky/restful-demo:latest -f ./server/Dockerfile ./server
