# Validation tools

`go.mod` and `go.sum` lock actionlint and kubeconform and their transitive
dependencies. CI builds with `-mod=readonly`; update the lock deliberately.
