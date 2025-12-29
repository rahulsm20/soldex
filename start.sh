cd client && bun dev &
cd services/server && bun dev & 
cd services/indexer && bun dev &
wait

trap "kill 0" EXIT