'use client'

import { useEffect, useState } from "react";
import UsersTable from "./UsersTable";
import Loader from "@/components/common/Loader";

export default function UsersPage() {
  // In a real app, you'd fetch from your API
  const usersResponse = {
    "statusCode": 200,
    "success": true,
    "data": [
      {
        "_id": "696755b84b54a1b2e800dad1",
        "name": "MD Sohel Rana",
        "email": "sohelf131@gmail.com",
        "password": "$2b$10$aysAZkLeVDzcP0XSncQjPeXhad0UIpU6AYZ.DPsEqXkMuEZPzmnmS",
        "role": "tenant",
        "createdAt": "2026-01-14T08:37:12.966Z",
        "updatedAt": "2026-01-14T11:05:30.874Z",
        "avatar": "https://res.cloudinary.com/dg83pvgls/image/upload/v1768382730/properties/sgdthl2pfgaj25uzmiwb.webp",
        "isVerified": false,
        "tenantProfile": {
          "_id": "696755b94b54a1b2e800dad3",
          "user": "696755b84b54a1b2e800dad1",
          "documents": [
            {
              "name": "NID",
              "url": "https://res.cloudinary.com/dg83pvgls/raw/upload/v1768387986/properties/f7r3tbfjbt1flhlzyggw.pdf",
              "uploadedAt": "2026-01-14T10:53:32.477Z",
              "_id": "696775ac160a6d2dc451d7f6"
            },
            {
              "name": "Aggreman",
              "url": "https://res.cloudinary.com/dg83pvgls/raw/upload/v1768388351/properties/bhskobkqprthzcgrfmft.pdf",
              "_id": "69677705160a6d2dc451d830",
              "uploadedAt": "2026-01-14T10:59:17.104Z"
            }
          ],
          "createdAt": "2026-01-14T08:37:13.038Z",
          "updatedAt": "2026-01-14T11:05:30.929Z",
          "address": "30, Rupnagar , Mirpur-2",
          "city": "Khulna",
          "country": "Bangladesh",
          "phone": "+1 (809) 555-01236574"
        }
      },
      {
        "_id": "6967563327cd8cb438a4e531",
        "name": "Sadman DA",
        "email": "super.admin@gmail.com",
        "password": "$2b$10$Gx75NoFfH6k/DB.P1u3gMOmz/ppoTi4Bnlb03cFcta81uLNbzCYm2",
        "role": "super_admin",
        "createdAt": "2026-01-14T08:39:15.193Z",
        "updatedAt": "2026-01-22T05:25:44.747Z",
        "isVerified": true
      },
      {
        "_id": "69678295c58d2f7c116ee40f",
        "name": "John Doe po",
        "email": "sardarit.bd.official@gmail.com",
        "password": "$2b$10$8aOEEOsk0g899Tm5ppmBWuMIPBS2WJkZAlk3sXUSPmxPUaNm4gaWG",
        "role": "owner",
        "createdAt": "2026-01-14T11:48:37.262Z",
        "updatedAt": "2026-01-15T05:33:34.599Z",
        "avatar": "https://res.cloudinary.com/dg83pvgls/image/upload/v1768448153/properties/p4eeght86tylrh9frv54.webp",
        "isVerified": false,
        "ownerProfile": {
          "_id": "69678295c58d2f7c116ee411",
          "user": "69678295c58d2f7c116ee40f",
          "documents": [
            {
              "name": "NID",
              "url": "https://res.cloudinary.com/dg83pvgls/raw/upload/v1768448175/properties/ntrbyhfsrtqnhwkwxrfb.pdf",
              "_id": "696860b9cb3499f07383cd1e",
              "uploadedAt": "2026-01-15T03:36:25.871Z"
            }
          ],
          "createdAt": "2026-01-14T11:48:37.315Z",
          "updatedAt": "2026-01-15T03:36:25.869Z",
          "address": "30, Rupnagar , Mirpur-2",
          "city": "Rajshahi",
          "country": "Bangladesh",
          "phone": "0123454645"
        }
      },
      {
        "_id": "69687cf99499fae2235e651e",
        "name": "wasij",
        "email": "owakeel.workspace@gmail.com",
        "password": "$2b$10$GYCSMGcFzVGn7oYvYVnGGuwE0Q.AYQ8LbNwWcgBZq2tVOTvZRJ5wC",
        "role": "owner",
        "createdAt": "2026-01-15T05:36:57.170Z",
        "updatedAt": "2026-01-15T07:27:33.055Z",
        "avatar": "https://res.cloudinary.com/dg83pvgls/image/upload/v1768462063/properties/xmtyc5lbfhw5vec3nibn.webp",
        "isVerified": true,
        "ownerProfile": {
          "_id": "69687cf99499fae2235e6520",
          "user": "69687cf99499fae2235e651e",
          "documents": [
            {
              "name": "Document Name",
              "url": "https://res.cloudinary.com/dg83pvgls/raw/upload/v1768455506/properties/mjwcb8wq4unqhpe38t7o.pdf",
              "_id": "69687d509499fae2235e653c",
              "uploadedAt": "2026-01-15T05:38:24.169Z"
            }
          ],
          "createdAt": "2026-01-15T05:36:57.224Z",
          "updatedAt": "2026-01-15T07:27:33.115Z",
          "address": "123 Main Street",
          "city": "New York",
          "country": "United States",
          "phone": "+1 (555) 123-4567"
        }
      }
    ],
    "message": "Users fetched Successfully"
  };

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/users`,
          {
            credentials: 'include'
          }
        )

        const data = await res.json()

        if (data.success) {
          setUsers(data.data)
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  },[])

  if(loading){
    return <Loader />
  }
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage and verify user accounts</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <UsersTable users={users} />
      </div>
    </div>
  );
}