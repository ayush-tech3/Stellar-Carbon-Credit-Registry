import { TrackedTransaction } from "@/stores/transaction-store";

export const INITIAL_TRANSACTIONS: TrackedTransaction[] = [
  {
    id: "tx-1",
    hash: "fc3234dd57bc383adf50fbf3cc79db3795e85edb02c0172c38bd76a1e26974ff",
    status: "confirmed",
    method: "issue_credits",
    contractId: "CAKKATMEKPX6BYMDIDFFDVADSJEFARV47R5VKFWXVK75HOCH455YWMVW",
    timestamp: Date.now() - 720000,
    retryCount: 0,
  },
  {
    id: "tx-2",
    hash: "128a115a65eaa27d061a9581724641142382d56eb1f44b9414c9417211ab9051",
    status: "confirmed",
    method: "retire",
    contractId: "CBDL7CHTWLZDJ6GXPAXX5FL53WY2VL342XY622OIQ3NTVPU7HCSWHAMA",
    timestamp: Date.now() - 2100000,
    retryCount: 0,
  },
  {
    id: "tx-3",
    hash: "931153832a472cf2c37d6faac11b56753b225b289008fef6cd49c54f444adbc6",
    status: "confirmed",
    method: "transfer",
    contractId: "CAKKATMEKPX6BYMDIDFFDVADSJEFARV47R5VKFWXVK75HOCH455YWMVW",
    timestamp: Date.now() - 4500000,
    retryCount: 0,
  },
];
