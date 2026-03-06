// التحقق من الموقع (محاكاة - يمكن استبدالها ب Geolocation API حقيقية)
// function checkLocation(divlocationStatus) {
//   const locationStatus = document.getElementById(divlocationStatus);
//   return new Promise((resolve) => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const distance = calculateDistance(
//             position.coords.latitude,
//             position.coords.longitude,
//             universityLat,
//             universityLng,
//           );

//           if (distance < 1.0) {
//             // داخل نطاق 1 كم
//             locationStatus.innerHTML = `
//                                    		<div class="bg-[#e8f5f1] rounded-2xl p-4 mb-10 flex items-center justify-between border border-[#d1e9e2]">
// 																				<div class="flex items-center gap-4">
// 																					<div class="w-10 h-10 bg-[#d1e9e2] rounded-xl flex items-center justify-center text-[#2d9d78]">
// 																						<i class="fas fa-map-marker-alt"></i>
// 																					</div>
// 																					<div class="text-right">
// 																						<h3 class="text-[#2d9d78] font-bold text-sm">موقعك مؤكد</h3>
// 																						<p class="text-[#2d9d78] text-xs opacity-80">أنت داخل الحرم الجامعي</p>
// 																					</div>
// 																				</div>
// 																				<button id="refreshLocation" class="text-[#2d9d78] hover:rotate-180 transition-transform duration-500">
// 																					<i class="fas fa-sync-alt"></i>
// 																				</button>
// 																			</div>
//                                 `;
//             document
//               .getElementById("refreshLocation")
//               .addEventListener("click", checkLocation("locationStatus"));
//             resolve(true);
//           } else {
//             locationStatus.innerHTML = `
//                                    		<div class="bg-red-50 rounded-2xl p-4 flex items-center justify-start border border-red-200 text-red-600">
// 																				<div class="flex items-center gap-4">
// 																					<div class="w-10 h-10 bg-[#d1e9e2] rounded-xl flex items-center justify-center text-[#2d9d78]">
// 																						<i class="fas fa-exclamation-triangle"></i>
// 																					</div>
// 																					<div class="text-right mr-4">
//                                         		<h3 class="font-bold text-sm">الموقع غير مؤكد</h3>
//                                         		<p class="text-xs opacity-80">يجب أن تكون داخل الحرم الجامعي</p>
//                                     			</div>
// 																				</div>
// 																				<button id="refreshLocation" class="text-[#2d9d78] hover:rotate-180 transition-transform duration-500">
// 																					<i class="fas fa-sync-alt"></i>
// 																				</button>
// 																			</div>
//                                 `;
//             document
//               .getElementById("refreshLocation")
//               .addEventListener("click", checkLocation("locationStatus"));
//             resolve(false);
//           }
//         },
//         (error) => {
//           console.warn("Geolocation error:", error);
//           locationStatus.innerHTML = `
// 															<div class="bg-yellow-50 rounded-2xl p-4 flex items-center justify-start border border-yellow-200 text-yellow-600">
// 																<div class="flex items-center gap-4">
// 																	<div class="w-10 h-10 bg-[#d1e9e2] rounded-xl flex items-center justify-center ">
// 																		<i class="fas fas fa-exclamation-circle"></i>
// 																	</div>
// 																	<div class="text-right mr-4">
// 																		<h3 class="font-bold text-sm">تعذر التحقق من الموقع</h3>
// 																		<p class="text-xs opacity-80">يرجى السماح بالوصول إلى الموقع</p>
// 																		</div>
// 																</div>
// 																<button id="refreshLocation" class=" text-[#2d9d78] hover:rotate-180 transition-transform duration-500">
// 																	<i class="fas fa-sync-alt"></i>
// 																</button>
// 															</div>
// 																`;
//           document
//             .getElementById("refreshLocation")
//             .addEventListener("click", checkLocation("locationStatus"));
//           resolve(false);
//         },
//       );
//     } else {
//       locationStatus.innerHTML = `
// 													<div class="bg-yellow-50 rounded-2xl p-4 flex items-center justify-start border border-yellow-200 text-yellow-600">
// 														<div class="flex items-center gap-4">
// 															<div class="w-10 h-10 bg-[#d1e9e2] rounded-xl flex items-center justify-center ">
// 																<i class="fas fas fa-exclamation-circle"></i>
// 															</div>
// 		                        <div class="text-right mr-4">
//                            		 <h3 class="font-bold text-sm">الموقع غير مدعوم</h3>
//                            		 <p class="text-xs opacity-80">متصفحك لا يدعم تحديد الموقع</p>
//                       		  </div>
// 														</div>
// 														<button class=" hover:rotate-180 transition-transform duration-500">
// 															<i class="fas fa-sync-alt"></i>
// 														</button>
// 													</div>
// 										`;
//       resolve(false);
//     }
//   });
// }


// التحقق من الموقع (مع إضافة زر منح الإذن عند الخطأ)
function checkLocation(divlocationStatus) {
  const locationStatus = document.getElementById(divlocationStatus);
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const distance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            universityLat,
            universityLng,
          );

          if (distance < 1.0) {
            // داخل نطاق 1 كم
            locationStatus.innerHTML = `
              <div class="bg-[#e8f5f1] rounded-2xl p-4 mb-10 flex items-center justify-between border border-[#d1e9e2]">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-[#d1e9e2] rounded-xl flex items-center justify-center text-[#2d9d78]">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div class="text-right">
                    <h3 class="text-[#2d9d78] font-bold text-sm">موقعك مؤكد</h3>
                    <p class="text-[#2d9d78] text-xs opacity-80">أنت داخل الحرم الجامعي</p>
                  </div>
                </div>
                <button id="refreshLocation" class="text-[#2d9d78] hover:rotate-180 transition-transform duration-500">
                  <i class="fas fa-sync-alt"></i>
                </button>
              </div>
            `;
            document.getElementById("refreshLocation").addEventListener("click", () => checkLocation(divlocationStatus));
            resolve(true);
          } else {
            locationStatus.innerHTML = `
              <div class="bg-red-50 rounded-2xl p-4 flex items-center justify-between border border-red-200 text-red-600">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                    <i class="fas fa-exclamation-triangle"></i>
                  </div>
                  <div class="text-right">
                    <h3 class="font-bold text-sm">الموقع غير مؤكد</h3>
                    <p class="text-xs opacity-80">يجب أن تكون داخل الحرم الجامعي</p>
                  </div>
                </div>
                <button id="refreshLocation" class="text-red-600 hover:rotate-180 transition-transform duration-500">
                  <i class="fas fa-sync-alt"></i>
                </button>
              </div>
            `;
            document.getElementById("refreshLocation").addEventListener("click", () => checkLocation(divlocationStatus));
            resolve(false);
          }
        },
        (error) => {
          console.warn("Geolocation error:", error);
          // في حالة الخطأ (رفض الإذن أو أي خطأ آخر) نعرض زرين: تحديث ومنح الإذن
          locationStatus.innerHTML = `
            <div class="bg-yellow-50 rounded-2xl p-4 flex items-center justify-between border border-yellow-200 text-yellow-600">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
                  <i class="fas fa-exclamation-circle"></i>
                </div>
                <div class="text-right">
                  <h3 class="font-bold text-sm">تعذر التحقق من الموقع</h3>
                  <p class="text-xs opacity-80">يرجى السماح بالوصول إلى الموقع</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button id="grantPermissionBtn" class="bg-yellow-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors">
                  منح الإذن
                </button>
                <button id="refreshLocation" class="text-yellow-600 hover:rotate-180 transition-transform duration-500">
                  <i class="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>
          `;
          document.getElementById("refreshLocation").addEventListener("click", () => checkLocation(divlocationStatus));
          document.getElementById("grantPermissionBtn").addEventListener("click", () => {
            // محاولة طلب الإذن مرة أخرى
            checkLocation(divlocationStatus);
          });
          resolve(false);
        },
      );
    } else {
      locationStatus.innerHTML = `
        <div class="bg-yellow-50 rounded-2xl p-4 flex items-center justify-between border border-yellow-200 text-yellow-600">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="text-right">
              <h3 class="font-bold text-sm">الموقع غير مدعوم</h3>
              <p class="text-xs opacity-80">متصفحك لا يدعم تحديد الموقع</p>
            </div>
          </div>
          <button class="text-yellow-600 hover:rotate-180 transition-transform duration-500">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      `;
      resolve(false);
    }
  });
}

// حساب المسافة بين نقطتين (باستخدام Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function showStatus(text, type) {
  statusMessage.textContent = text;
  statusMessage.style.display = "block";
  if (type === "success") {
    statusMessage.className =
      "bg-green-100 text-green-800 border border-green-200";
  } else {
    statusMessage.className = "bg-red-100 text-red-800 border border-red-200";
  }
  setTimeout(() => {
    statusMessage.style.display = "none";
  }, 4000);
}
