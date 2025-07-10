import React, { useState } from "react";
import { jsPDF } from "jspdf";

export default function MiseEnDemeureGenerator() {
  const logo = "URL_OU_BASE64_DE_TON_LOGO"; // remplace avec ton logo Yesod

  // … tous tes useState et fonctions add/update/remove factures …

  const handleDownload = async () => {
    const doc = new jsPDF();
    // 1) logo
    if (logo) {
      try {
        const img = await loadImage(logo);
        doc.addImage(img, "PNG", 10, 8, 32, 16);
      } catch {}
    }

    // 2) en-tête, corps, factures… (inchangés)

    // 3) signature
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      `Maître Yankel BENSIMHON\nCabinet d’avocat — Yesod\n43 avenue Foch, 75116 Paris`,
      10,
      /* à calculer en fonction de y */
    );

    // 4) footer Yesod
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Service opéré par le Cabinet d’avocat Yankel Bensimhon, inscrit au Barreau de Paris — Yesod`, 
      10, 
      287
    );
    doc.text(
      `43 avenue Foch, 75116 Paris`,
      10,
      292
    );

    doc.save("Mise_en_demeure_Yesod.pdf");
  };

  return (
    <div>
      {/* ton formulaire inchangé */}
      <button onClick={handleDownload}>Télécharger la mise en demeure</button>
    </div>
  );
}

// utilitaire de chargement d’image
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      c.getContext("2d").drawImage(img, 0, 0);
      resolve(c.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
}
