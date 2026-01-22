"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle, Upload, Eraser, Undo2, Download } from "lucide-react";

export default function SignatureView({ data, onSign, loading }) {
  const [tenantAgreed, setTenantAgreed] = useState(false);

  // "draw" | "type" | "upload"
  const [sigMode, setSigMode] = useState("draw");

  // typed signature
  const [typedSignature, setTypedSignature] = useState("");

  // uploaded signature dataURL
  const [uploadedSignature, setUploadedSignature] = useState("");

  // canvas signature
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const pointsRef = useRef([]); // for undo (store snapshots)

  // ---------- Canvas helpers ----------
  const getCanvas = () => canvasRef.current;

  const resizeCanvasToDisplaySize = () => {
    const canvas = getCanvas();
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const width = Math.floor(rect.width * dpr);
    const height = Math.floor(rect.height * dpr);

    if (canvas.width !== width || canvas.height !== height) {
      // Save current drawing
      const prev = canvas.toDataURL("image/png");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      // Basic style
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = "#0f172a";

      ctxRef.current = ctx;

      // restore drawing
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = prev;
    }
  };

  useEffect(() => {
    // init ctx
    const canvas = getCanvas();
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "#0f172a";
    ctxRef.current = ctx;

    // initial size
    resizeCanvasToDisplaySize();

    const onResize = () => resizeCanvasToDisplaySize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getPos = (e) => {
    const canvas = getCanvas();
    const rect = canvas.getBoundingClientRect();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const pushSnapshot = () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    pointsRef.current.push(url);
    // keep last 20 snapshots
    if (pointsRef.current.length > 20) pointsRef.current.shift();
  };

  const startDraw = (e) => {
    if (sigMode !== "draw") return;
    e.preventDefault();
    const ctx = ctxRef.current;
    if (!ctx) return;

    pushSnapshot();
    drawingRef.current = true;

    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (sigMode !== "draw") return;
    if (!drawingRef.current) return;
    e.preventDefault();

    const ctx = ctxRef.current;
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    setHasDrawn(true);
  };

  const endDraw = (e) => {
    if (sigMode !== "draw") return;
    if (!drawingRef.current) return;
    e.preventDefault();

    drawingRef.current = false;
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.closePath();
  };

  const clearCanvas = () => {
    const canvas = getCanvas();
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    pushSnapshot();
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  };

  const undoCanvas = () => {
    const canvas = getCanvas();
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const prev = pointsRef.current.pop();
    const rect = canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);

    if (!prev) {
      setHasDrawn(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      // if image not empty, keep hasDrawn true
      setHasDrawn(true);
    };
    img.src = prev;
  };

  const downloadSignature = () => {
    const dataUrl = getSignatureDataUrl();
    if (!dataUrl) return;

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `signature-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ---------- Upload ----------
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedSignature(reader.result?.toString() || "");
      setSigMode("upload");
    };
    reader.readAsDataURL(file);
  };

  // ---------- Signature output ----------
  const getSignatureDataUrl = () => {
    if (sigMode === "upload" && uploadedSignature) return uploadedSignature;

    if (sigMode === "type" && typedSignature.trim()) {
      // Render typed text as image via canvas offscreen
      const off = document.createElement("canvas");
      off.width = 900;
      off.height = 250;
      const c = off.getContext("2d");
      c.fillStyle = "white";
      c.fillRect(0, 0, off.width, off.height);
      c.fillStyle = "#0f172a";
      c.font = "64px serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(typedSignature.trim(), off.width / 2, off.height / 2);
      return off.toDataURL("image/png");
    }

    if (sigMode === "draw" && hasDrawn) {
      const canvas = getCanvas();
      return canvas?.toDataURL("image/png") || "";
    }

    return "";
  };

  const canSign = useMemo(() => {
    const hasAnySignature =
      (sigMode === "draw" && hasDrawn) ||
      (sigMode === "type" && typedSignature.trim().length > 0) ||
      (sigMode === "upload" && !!uploadedSignature);

    return tenantAgreed && hasAnySignature && !loading;
  }, [
    tenantAgreed,
    sigMode,
    hasDrawn,
    typedSignature,
    uploadedSignature,
    loading,
  ]);

  const handleSubmitSign = () => {
    const signatureDataUrl = getSignatureDataUrl();
    onSign?.({
      signatureDataUrl,
      signatureMode: sigMode,
      typedSignature: typedSignature,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1F3A34]">
          LEASE AGREEMENT - E-SIGNATURE
        </h1>
        <p className="text-gray-600 mt-2">
          Review and sign the lease agreement below
        </p>
      </div>

      <div className="space-y-6">
        {/* Agreement Summary */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-4">
            Agreement Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Property</p>
              <p className="font-medium">{data?.propertyAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Rent</p>
              <p className="font-medium">${data?.monthlyRent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lease Term</p>
              <p className="font-medium">
                {data?.startDate
                  ? new Date(data.startDate).toLocaleDateString()
                  : "—"}{" "}
                -{" "}
                {data?.endDate
                  ? new Date(data.endDate).toLocaleDateString()
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Security Deposit</p>
              <p className="font-medium">${data?.securityDeposit}</p>
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="p-6 border rounded-lg">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={tenantAgreed}
              onChange={(e) => setTenantAgreed(e.target.checked)}
              className="mt-1 mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">
                I have read and agree to all terms and conditions of this lease
                agreement
              </p>
              <p className="text-sm text-gray-600 mt-2">
                By checking this box and providing your signature, you agree to
                be legally bound by all terms of this agreement.
              </p>
            </div>
          </label>
        </div>

        {/* Signature Controls */}
        <div className="p-6 border rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h3 className="font-medium text-gray-900">Your Signature</h3>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSigMode("draw")}
                className={`px-3 py-2 rounded-lg text-sm border ${
                  sigMode === "draw"
                    ? "bg-[#1F3A34] text-white border-[#1F3A34]"
                    : "hover:bg-gray-50"
                }`}
              >
                Draw
              </button>
              <button
                type="button"
                onClick={() => setSigMode("type")}
                className={`px-3 py-2 rounded-lg text-sm border ${
                  sigMode === "type"
                    ? "bg-[#1F3A34] text-white border-[#1F3A34]"
                    : "hover:bg-gray-50"
                }`}
              >
                Type
              </button>
              <label
                className={`px-3 py-2 rounded-lg text-sm border cursor-pointer flex items-center gap-2 ${
                  sigMode === "upload"
                    ? "bg-[#1F3A34] text-white border-[#1F3A34]"
                    : "hover:bg-gray-50"
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>

              <button
                type="button"
                onClick={downloadSignature}
                className="px-3 py-2 rounded-lg text-sm border hover:bg-gray-50 flex items-center gap-2"
                disabled={!getSignatureDataUrl()}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          {/* DRAW */}
          {sigMode === "draw" && (
            <>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
                <div className="w-full h-48">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full rounded-md bg-white touch-none"
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={endDraw}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={undoCanvas}
                  className="px-3 py-2 rounded-lg text-sm border hover:bg-gray-50 flex items-center gap-2"
                >
                  <Undo2 className="w-4 h-4" />
                  Undo
                </button>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="px-3 py-2 rounded-lg text-sm border hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eraser className="w-4 h-4" />
                  Clear
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Draw with your mouse or finger (mobile supported)
              </p>
            </>
          )}

          {/* TYPE */}
          {sigMode === "type" && (
            <>
              <input
                type="text"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Type your full name as signature"
                className="w-full px-4 py-2 border rounded-lg mb-3"
              />
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <p
                  className="text-3xl text-center"
                  style={{ fontFamily: "serif" }}
                >
                  {typedSignature || "—"}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                You can type your legal name as an e-signature
              </p>
            </>
          )}

          {/* UPLOAD */}
          {sigMode === "upload" && (
            <>
              <div className="border rounded-lg p-4 bg-gray-50">
                {uploadedSignature ? (
                  <img
                    src={uploadedSignature}
                    alt="Uploaded signature"
                    className="max-h-48 mx-auto object-contain"
                  />
                ) : (
                  <p className="text-gray-500 text-center">
                    Upload a signature image (PNG/JPG)
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Tip: Use a transparent PNG for best result
              </p>
            </>
          )}
        </div>

        {/* Sign Button */}
        <div className="text-center pt-6 border-t">
          <button
            onClick={handleSubmitSign}
            disabled={!canSign}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Signing...
              </>
            ) : (
              <>
                <CheckCircle className="inline-block mr-2 h-5 w-5" />
                Sign Lease Agreement
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Your IP address and timestamp will be recorded for security purposes
          </p>
        </div>
      </div>
    </div>
  );
}
