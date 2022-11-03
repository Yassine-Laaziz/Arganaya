import { useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"

const useCheckAuthorized = () => {
  const router = useRouter()

  useEffect(async () => {
    try {
      const jwtToken = localStorage.getItem("token")
      const response = await axios.post("/api/checkAuthorized", { jwtToken })
      const { user, verified } = response.data
      if (!user) return router.push("/Login")
      if (!verified) return router.push(`/Verify`)
      return { user, verified }
    } catch (e) {
      router.push("/Login")
      return { user: null, verified: null }
    }
  }, [])
}
export default useCheckAuthorized
