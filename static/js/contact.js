async function handleFormspreeSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formspreeUrl = form.dataset.action;
  const data = new FormData(form);

  if (window.hcaptcha && !hcaptcha.getResponse()) {
    contactAlert("warning", "Please complete the captcha before submitting.");
    return;
  }

  try {
    const response = await fetch(formspreeUrl, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    });

    if (response.ok) {
      contactAlert("success", "Thanks for your submission!");
      form.reset();
      if (window.hcaptcha) hcaptcha.reset();
    } else {
      let resData = {};
      try {
        resData = await response.json();
      } catch (e) {
        contactAlert("danger", "Submission failed. Please try again.");
        return;
      }

      if (resData.error) {
        contactAlert("danger", resData.error);
        return;
      }

      if (resData.errors && resData.errors.length > 0) {
        resData.errors.forEach(err => {
          contactAlert("danger", err.message || "Submission failed.");
        });
        return;
      }

      contactAlert("danger", "Submission failed. Please check the form and try again.");
    }
  } catch (err) {
    contactAlert("danger", "Oops! There was a problem submitting your form");
  }
}

function contactAlert(type, message) {
  const contactFormStatus = document.getElementById("contact-form-status");

  let icon;
  let ariaLabel;

  switch (type) {
    case "success":
      icon = "check-circle-fill";
      ariaLabel = "Success";
      break;
    case "danger":
      icon = "x-circle-fill";
      ariaLabel = "Error";
      break;
    case "warning":
      icon = "exclamation-triangle-fill";
      ariaLabel = "Warning";
      break;
    default:
      icon = "info-circle-fill";
      ariaLabel = "Info";
  }

  const alert = `
    <div class="alert alert-${type} d-flex align-items-center" role="alert">
      <svg class="bi flex-shrink-0 me-2" role="img" aria-label="${ariaLabel}:">
        <use xlink:href="#${icon}" />
      </svg>
      <div>${message}</div>
      <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
    </div>
  `;
  contactFormStatus.innerHTML = alert;

  // Remove alert after 10 seconds
  setTimeout(function () {
    contactFormStatus.innerHTML = "";
  }, 10000);
}
