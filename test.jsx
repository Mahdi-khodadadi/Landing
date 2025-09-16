<div className="flex justify-center p-8 bg-white/10 h-[55rem] font-sans">
      <div className="p-5 bg-white rounded-r-xl w-1/2">
        <h1 className="text-2xl mb-8 text-gray-900 font-bold">{t("contact.title")}</h1>

        <div className="space-y-6">
          <div>
            <h4 className="text-gray-700 font-semibold">{t("contact.addressLabel")}</h4>
            <h5 className="text-gray-600">{t("contact.address")}</h5>
          </div>

          <div>
            <h4 className="text-gray-700 font-semibold">{t("contact.phoneLabel")}</h4>
            <div className="space-y-1">
              <CopyableText text="09352403786" />
              <CopyableText text="03152408907" />
            </div>
          </div>

          <div>
            <h4 className="text-gray-700 font-semibold">{t("contact.emailLabel")}</h4>
            <CopyableText text="xmahdi7886@gmail.com" />
          </div>
        </div>

        <div className="mt-8">
          <iframe
            title={t("contact.mapTitle")}
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d956.1580353382299!2d51.50941892394233!3d32.34070836259509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1746351395422!5m2!1sen!2s"
            width="100%"
            height="450"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0"
          ></iframe>
        </div>
      </div>
    </div>